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
    runs-on: ubuntu-latest
    steps:
      - name: Perform Lighthouse check
        uses: Spartakyste/lighthouse-ci@main
        with:
          urls: "http://example.com/"
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
        uses: Spartakyste/lighthouse-ci@main
        with:
          urls: "http://example.com/"
          token: ${{ secrets.GITHUB_TOKEN }}
          performanceThreshold: 100
          accessibilityThreshold: 90
          bestPracticesThreshold: 25
          SEOThreshold: 67
          PWAThreshold: 10

```

## How to update me

In order to work, the repository must commit the *node_modules* and the compiled version of our Typescript code.

When we use the action from NOA, it'll basically go read the *index.js* WITHIN the dist directory.

If you make ANY update to the Typescript files, be sure to run `npx tsc` before you start to commit your changes. If you don't, the builded directory won't change and your changes won't applied.

Be sure to change the branch names within the github action, to properly test your branch and check nothing broke by accident.
- We use "http://example.com/" as an easy testable url