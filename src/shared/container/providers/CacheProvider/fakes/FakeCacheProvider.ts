import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key:string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const result = this.cache[key];

    if (!result) {
      return null;
    }

    const parsedResult = JSON.parse(result) as T;

    return parsedResult;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(keyPrefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key => (
      key.startsWith(`${keyPrefix}:`)
    ));

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}

export default FakeCacheProvider;
