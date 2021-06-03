# Lighthouse-ci

A simple and fast action to perform a [Lighthouse](https://developers.google.com/web/tools/lighthouse) run.

## Features

-   Automatically post a comment on your Pull Request with your scores
-   Can enforce minimum score for all categories
-   Support only one url at a time (for now)

## Configuration

```yml
with:
    # Called urls as you'll be able to pass multiples urls in the future
    urls: 'http://example.com/' # Required
    # Your PAT or GITHUB_TOKEN, on order to be able to post a comment on your Pull Request
    token: ${{ secrets.GITHUB_TOKEN }} # Required
    performanceThreshold: 50 # Optionnal, must be a number
    accessibilityThreshold: 50 # Optionnal, must be a number
    bestPracticesThreshold: 50 # Optionnal, must be a number
    SEOThreshold: 50 # Optionnal, must be a number
    PWAThreshold: 50 # Optionnal, must be a number
```

## Examples

### Basic example

```yml
name: Run Lighthouse

on:
    pull_request:
        branches: [master]

jobs:
    lighthouse-check:
        - name: Perform Lighthouse check
          uses: Spartakyste/lighthouse-ci@main
          with:
              urls: 'http://example.com/'
              token: ${{ secrets.GITHUB_TOKEN }}
```

### With minimum score enforcement

```yml
name: Run Lighthouse with Minimum Score Enforcement

on:
    pull_request:
        branches: [master]

jobs:
    lighthouse-check:
        - name: Perform Lighthouse check
          uses: Spartakyste/lighthouse-ci@main
          with:
              urls: 'http://example.com/'
              token: ${{ secrets.GITHUB_TOKEN }}
              performanceThreshold: 100
              accessibilityThreshold: 90
              bestPracticesThreshold: 25
              SEOThreshold: 67
              PWAThreshold: 20
```
