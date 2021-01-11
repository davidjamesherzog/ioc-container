const IocContainer = require('./dist/ioc-container.cjs.js');

const iocContainer = new IocContainer();

// Config object
const configObject = {
  autoplay: true,
  controls: true,
  muted: false
};

// Ads services
const adService = class AdService {
  constructor() {
    this.type = 'DFP';
  }
};

// Logger - singleton
const logger = class Logger {
  constructor() {
    this.level = 'DEBUG';
  }
};

// Video service
const video = class Video {
  constructor(configObject, adService, logger) {
    this.configObject = configObject;
    this.adService = adService;
    this.logger = logger;
  }
};

// register config and classes
iocContainer.register('configObject', configObject);
iocContainer.register('adService', adService);
iocContainer.singleton('logger', logger);
iocContainer.register('video', video, ['configObject', 'adService', 'logger']);

// construct video instance
const videoInstance = iocContainer.get('video');

// print out video instance
console.log(videoInstance);
