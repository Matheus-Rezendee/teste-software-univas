import {describe, it, expect} from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

describe ('normalizeName', ()=> {
    it('testar nome todo minusculo', ()=> {
        expect(normalizeName("MATHEUS")).toBe("matheus")
    })
})