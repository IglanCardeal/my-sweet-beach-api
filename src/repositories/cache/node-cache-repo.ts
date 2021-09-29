import NodeCache from 'node-cache'
import config from 'config'

const standardTtlInSeconds = config.get<number>('App.cache.standardTtl')

class NodeCacheRepository {
  private cacheProvider: NodeCache

  constructor () {
    this.cacheProvider = new NodeCache({ stdTTL: standardTtlInSeconds })
  }

  public setCacheKey (lat: number, long: number): string {
    return `lat=${lat}-long=${long}`
  }

  public setCacheValue<T> (key: string, value: T): void {
    this.cacheProvider.set(key, value, standardTtlInSeconds)
  }

  public getCacheValueForKey<T> (key: string): T | undefined {
    return this.cacheProvider.get(key)
  }
}

const CacheRepository = Object.freeze(new NodeCacheRepository())

export { CacheRepository }
