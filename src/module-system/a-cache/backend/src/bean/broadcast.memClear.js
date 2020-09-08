module.exports = ctx => {
  class Broadcast {

    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(data.moduleName);
        moduleCache._clear();
      }
    }

  }

  return Broadcast;
};