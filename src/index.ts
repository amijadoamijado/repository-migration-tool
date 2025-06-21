import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface MigrationConfig {
  githubToken: string;
  sourceOwner: string;
  sourceRepo: string;
  targetOwner: string;
  targetRepo: string;
  batchSize?: number;
  delayMs?: number;
}

class RepositoryMigrationTool {
  private octokit: Octokit;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = {
      batchSize: 50,
      delayMs: 1000,
      ...config
    };
    
    this.octokit = new Octokit({
      auth: this.config.githubToken
    });
  }

  /**
   * Validate configuration and GitHub API access
   */
  async validateConfig(): Promise<boolean> {
    try {
      // Test GitHub API access
      await this.octokit.rest.users.getAuthenticated();
      
      // Validate source repository access
      await this.octokit.rest.repos.get({
        owner: this.config.sourceOwner,
        repo: this.config.sourceRepo
      });
      
      // Validate target repository access
      await this.octokit.rest.repos.get({
        owner: this.config.targetOwner,
        repo: this.config.targetRepo
      });
      
      console.log('✅ Configuration validated successfully');
      return true;
    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Get all files from source repository
   */
  async getSourceFiles(path: string = ''): Promise<any[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.sourceOwner,
        repo: this.config.sourceRepo,
        path
      });
      
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error(`Error getting files from ${path}:`, error);
      return [];
    }
  }

  /**
   * Migrate a single file
   */
  async migrateFile(file: any): Promise<boolean> {
    try {
      if (file.type === 'file') {
        // Get file content
        const contentResponse = await this.octokit.rest.repos.getContent({
          owner: this.config.sourceOwner,
          repo: this.config.sourceRepo,
          path: file.path
        });
        
        const fileData = contentResponse.data as any;
        
        // Create or update file in target repository
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.config.targetOwner,
          repo: this.config.targetRepo,
          path: file.path,
          message: `Migrate: ${file.path}`,
          content: fileData.content,
          encoding: 'base64'
        });
        
        console.log(`✅ Migrated: ${file.path}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Failed to migrate ${file.path}:`, error);
      return false;
    }
  }

  /**
   * Migrate all files with batch processing
   */
  async migrateRepository(): Promise<void> {
    console.log('🚀 Starting repository migration...');
    
    // Validate configuration first
    const isValid = await this.validateConfig();
    if (!isValid) {
      throw new Error('Configuration validation failed');
    }
    
    // Get all files recursively
    const allFiles = await this.getAllFilesRecursively();
    console.log(`📁 Found ${allFiles.length} files to migrate`);
    
    // Process files in batches
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < allFiles.length; i += this.config.batchSize!) {
      const batch = allFiles.slice(i, i + this.config.batchSize!);
      
      console.log(`🔄 Processing batch ${Math.floor(i / this.config.batchSize!) + 1}/${Math.ceil(allFiles.length / this.config.batchSize!)}`);
      
      // Process batch
      const batchPromises = batch.map(file => this.migrateFile(file));
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Count results
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          successCount++;
        } else {
          failCount++;
        }
      });
      
      // Delay between batches to respect rate limits
      if (i + this.config.batchSize! < allFiles.length) {
        await this.delay(this.config.delayMs!);
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} files`);
    console.log(`❌ Failed to migrate: ${failCount} files`);
    console.log(`📁 Total files: ${allFiles.length}`);
    
    if (failCount === 0) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️ Migration completed with some failures');
    }
  }

  /**
   * Get all files recursively from repository
   */
  private async getAllFilesRecursively(path: string = '', files: any[] = []): Promise<any[]> {
    const items = await this.getSourceFiles(path);
    
    for (const item of items) {
      if (item.type === 'file') {
        files.push(item);
      } else if (item.type === 'dir') {
        await this.getAllFilesRecursively(item.path, files);
      }
    }
    
    return files;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  try {
    const config: MigrationConfig = {
      githubToken: process.env.GITHUB_TOKEN!,
      sourceOwner: process.env.SOURCE_OWNER!,
      sourceRepo: process.env.SOURCE_REPO!,
      targetOwner: process.env.TARGET_OWNER!,
      targetRepo: process.env.TARGET_REPO!,
      batchSize: parseInt(process.env.MIGRATION_BATCH_SIZE || '50'),
      delayMs: parseInt(process.env.MIGRATION_DELAY_MS || '1000')
    };

    // Validate required environment variables
    const required = ['githubToken', 'sourceOwner', 'sourceRepo', 'targetOwner', 'targetRepo'];
    const missing = required.filter(key => !config[key as keyof MigrationConfig]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('Please check your .env file and ensure all required variables are set.');
      process.exit(1);
    }

    const migrationTool = new RepositoryMigrationTool(config);
    await migrationTool.migrateRepository();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { RepositoryMigrationTool, MigrationConfig };