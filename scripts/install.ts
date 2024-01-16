import { readFileSync, writeFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { input } from '@inquirer/prompts'
import { execa } from 'execa'
import glob from 'fast-glob'

const validate = (value: string) => value.length > 0

const config = {
    name: await input({
        message: 'What is your name?',
        default: await execa('git', ['config', 'user.name']).then((res) => res.stdout),
        validate,
    }),
    email: await input({
        message: 'What is your email address?',
        default: await execa('git', ['config', 'user.email']).then((res) => res.stdout),
        validate,
    }),
    repo: await input({ message: 'What is your repository name?', validate }),
    packageName: await input({ message: 'What is your package name?', validate }),
    packageDescription: await input({ message: 'What is your package description?', validate }),
}

const replace = (content: string) => {
    for (const key in config) {
        content = content.replaceAll(new RegExp(`{%${key}%}`, 'g'), config[key].trim())
    }

    return content
}

const files = await glob(['./*.md', './package.json'], { onlyFiles: true, absolute: true })

for (const file of files) {
    writeFileSync(file, replace(readFileSync(file, 'utf8')), { encoding: 'utf8' })
}

await execa('pnpm', ['uninstall', '@inquirer/prompts', 'fast-glob'])
await rm('./scripts/install.ts', { force: true })
