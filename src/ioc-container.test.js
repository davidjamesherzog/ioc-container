import IocContainer from './ioc-container';

describe('test the container', () => {

  let iocContainer;

  beforeEach(() => {
    iocContainer = new IocContainer();
  });

  test('should create container and resolve class instance', () => {
    const video = class Video {
      constructor() {
        this.value = 1;
      }
    };

    iocContainer.register('video', video);
    const videoInstance = iocContainer.get('video');
    expect(videoInstance.value).toBe(1);
  });

  test('should create container and two class instances', () => {
    const video = class Video {
      constructor() {
        this.value = 1;
      }
    };
    iocContainer.register('video', video);
    const videoInstance = iocContainer.get('video');
    videoInstance.value = 2;
    expect(videoInstance.value).toBe(2);

    const secondVideoInstance = iocContainer.get('video');
    expect(secondVideoInstance.value).toBe(1);
  });

  test('should resolve class object dependencies', () => {
    const configObject = {
      autoplay: true
    };
    const adService = class AdService {
      constructor() {
        this.type = 'DFP';
      }
    };
    const video = class Video {
      constructor(configObject, adService) {
        this.configObject = configObject;
        this.adService = adService;
      }
    };
    iocContainer.register('configObject', configObject);
    iocContainer.register('adService', adService);
    iocContainer.register('video', video, ['configObject', 'adService']);
    const videoInstance = iocContainer.get('video');
    expect(videoInstance.configObject.autoplay).toBeTruthy();
    expect(videoInstance.adService.type).toEqual('DFP');
  });

  test('should resolve a shared singleton class', () => {
    const video = class Video {
      constructor() {
        this.value = 1;
      }
    };
    iocContainer.singleton('video', video);

    const videoInstance = iocContainer.get('video');
    expect(videoInstance.value).toBe(1);
    videoInstance.value = 2;
    const videoInstance2 = iocContainer.get('video');
    expect(videoInstance2.value).toBe(2);
  });


  test('should resolve a class with singleton dependency', () => {
    const logger = class Logger {
      constructor() {
        this.level = 'DEBUG';
      }
    };
    const video = class Video {
      constructor(logger) {
        this.logger = logger;
      }
    };

    iocContainer.singleton('logger', logger);
    iocContainer.register('video', video, ['logger']);
    const videoInstance = iocContainer.get('video');
    videoInstance.logger.level = 'TRACE';

    const videoInstance2 = iocContainer.get('video');
    expect(videoInstance2.logger.level).toBe('TRACE');
  });
});
