import config from 'config'

import { CacheRepository } from '../node-cache-repo'

const standardTtlInSeconds = config.get<number>('App.cache.standardTtl')

describe('Cache Repository', () => {
  const testCacheKey = CacheRepository.setCacheKey(0, 0)
  jest.useFakeTimers()

  it('should return cache key with correct format', () => {
    expect(testCacheKey).toBe(`lat=0-long=0`)
  })

  it('should return undefined when no cached value was found', () => {
    const cachedValue = CacheRepository.getCacheValueForKey(testCacheKey)
    expect(cachedValue).toBe(undefined)
  })

  it('should return cached value with correct shape', () => {
    interface Obj {
      foo: boolean
      bar: number
    }
    const testObj: Obj = { foo: true, bar: 1 }
    CacheRepository.setCacheValue<Obj>(testCacheKey, testObj)
    const cachedValue = CacheRepository.getCacheValueForKey<Obj>(testCacheKey)
    expect(cachedValue).toEqual(testObj)
  })

  it('should return undefined after cached value expiration time reach', () => {
    interface Obj {
      foo: boolean
      bar: number
    }
    const testObj2: Obj = { foo: true, bar: 1 }
    CacheRepository.setCacheValue<Obj>(testCacheKey, testObj2)
    const currentTimestamp = Date.now()
    const cacheTtlPlusOneSecond = standardTtlInSeconds + 1
    const plusOneHourInMs = cacheTtlPlusOneSecond * 1_000
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => currentTimestamp + plusOneHourInMs)
    const cachedValue = CacheRepository.getCacheValueForKey<Obj>(testCacheKey)
    expect(cachedValue).toBe(undefined)
    jest.restoreAllMocks()
  })
})
