/* istanbul ignore file */
import * as core from '@actions/core';
import { start } from 'start';

try {
    start();
} catch (error) {
    core.setFailed(error.message);
}
