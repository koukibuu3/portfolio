#!/bin/bash

echo "Initializing submodules..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Warning: Not in a git repository. Skipping submodule initialization."
    exit 0
fi

# Check if .gitmodules exists
if [ ! -f ".gitmodules" ]; then
    echo "Warning: No .gitmodules file found. Skipping submodule initialization."
    exit 0
fi

# Initialize and update submodules
if git submodule init; then
    echo "Submodule init successful"
else
    echo "Warning: Submodule init failed"
fi

if git submodule update --recursive; then
    echo "Submodule update successful"
else
    echo "Warning: Submodule update failed"
fi

# Check if notes directory exists
if [ -d "notes" ]; then
    echo "Notes directory found"
    ls -la notes/
else
    echo "Warning: Notes directory not found after submodule initialization"
    echo "Creating empty notes directory structure for fallback"
    mkdir -p notes/Article
    echo "# No articles available" > notes/Article/README.md
fi

echo "Submodule initialization complete"