class IocContainer {

  constructor() {
    this._services = new Map();
    this._singletons = new Map();
  }

  // register a service
  register(name, definition, dependencies) {
    this._services.set(name, {
      definition: definition,
      dependencies: dependencies
    });
  }

  // register a singleton service - same instance of the service will always be returned
  singleton(name, definition, dependencies) {
    this._services.set(name, {
      definition: definition,
      dependencies: dependencies,
      singleton:true
    });
  }

  get(name) {
    const service = this._services.get(name);

    if (typeof service.definition === 'function') {
      if (service.singleton) {
        let singletonInstance = this._singletons.get(name);
        if (singletonInstance) {
          return singletonInstance;
        } else {
          singletonInstance = this._createInstance(service);
          this._singletons.set(name, singletonInstance);
          return singletonInstance;
        }
      }
      return this._createInstance(service);
    } else {
      return service.definition;
    }
  }

  _getDependencies(service) {
    let classDependencies = [];

    if(service.dependencies) {
      classDependencies = service.dependencies.map((dep) => {
        return this.get(dep);
      })
    }
    return classDependencies;
  }

  _createInstance(service) {
    return new service.definition(...this._getDependencies(service));
  }
}

export default IocContainer;
