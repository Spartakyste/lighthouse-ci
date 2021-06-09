# Lighthouse-ci

A simple and fast action to perform a [Lighthouse](https://developers.google.com/web/tools/lighthouse) run.

## Features

-   Automatically posts a comment on your Pull Request with your scores
-   Can enforce a minimum score for all categories

## Limitations

-   Supports only one url at a time (for now)

## Configuration

```yml
with:
    # Called urls as you'll be able to pass multiples urls in the future
    urls: 'http://example.com/' # Required
    # Your PAT or GITHUB_TOKEN, in order to be able to post a comment on your Pull Request
    token: ${{ secrets.GITHUB_TOKEN }} # Required
    performanceThreshold: 50 # Optional, must be a number
    accessibilityThreshold: 50 # Optional, must be a number
    bestPracticesThreshold: 50 # Optional, must be a number
    SEOThreshold: 50 # Optional, must be a number
    PWAThreshold: 50 # Optional, must be a number
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
        runs-on: ubuntu-latest
        steps:
            - name: Perform Lighthouse check
              uses: OthrysDev/lighthouse-ci@main
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
        runs-on: ubuntu-latest
        steps:
            - name: Perform Lighthouse check
              uses: OthrysDev/lighthouse-ci@main
              with:
                  urls: 'http://example.com/'
                  token: ${{ secrets.GITHUB_TOKEN }}
                  performanceThreshold: 100
                  accessibilityThreshold: 90
                  bestPracticesThreshold: 25
                  SEOThreshold: 67
                  PWAThreshold: 10
```

## How to update me

In order to work, the repository must contain the _node_modules_ and the compiled version of the Typescript code.

When we use the action from another repository, it'll basically go read the _index.js_ WITHIN the dist directory.

If you make ANY update to the Typescript files, be sure to run `npx tsc` before you commit your changes. If you don't, the built directory won't change and your changes won't be applied.

Be sure to change the branch names within the github action, to properly test your branch and check nothing broke by accident.

-   We use "http://example.com/" as an easy testable url
