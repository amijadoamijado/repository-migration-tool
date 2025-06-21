# Repository Migration Tool

GitHub repository migration automation tool for efficient file transfer between repositories.

## Features

- **Automated Migration**: Transfer files between GitHub repositories automatically
- **Batch Processing**: Handle multiple files efficiently with configurable batch sizes
- **Docker Support**: Run in containerized environment for consistent execution
- **Error Handling**: Robust error handling with retry mechanisms
- **Rate Limit Management**: Intelligent handling of GitHub API rate limits

## Quick Start

### Prerequisites

- Node.js 18 or higher
- GitHub Personal Access Token with appropriate permissions
- Docker (optional, for containerized execution)

### Installation

```bash
# Clone the repository
git clone https://github.com/amijadoamijado/repository-migration-tool.git
cd repository-migration-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your GitHub token and repository details
```

### Configuration

Create a `.env` file with the following variables:

```
GITHUB_TOKEN=your_personal_access_token
SOURCE_OWNER=source_github_username
SOURCE_REPO=source_repository_name
TARGET_OWNER=target_github_username
TARGET_REPO=target_repository_name
```

### Usage

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# Docker mode
docker-compose up
```

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Docker Guide](docs/docker-setup.md) - Docker environment setup

## Features in Detail

### GitHub API Integration
- Uses GitHub REST API for file operations
- Handles authentication with Personal Access Tokens
- Manages API rate limits automatically

### File Transfer Capabilities
- Transfer individual files or entire directories
- Preserve file structure and metadata
- Handle large files efficiently

### Error Recovery
- Automatic retry on transient failures
- Detailed error logging and reporting
- Graceful handling of API limitations

## Requirements

- GitHub Personal Access Token with `repo`, `workflow`, and `delete_repo` permissions
- Node.js 18+ for local execution
- Docker for containerized execution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the GitHub repository.
