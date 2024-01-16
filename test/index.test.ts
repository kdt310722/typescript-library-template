import { expect, test } from 'vitest'
import helloWorld from '../src'

test('should return hello world', () => {
    expect(helloWorld()).toBe('Hello World!')
})
