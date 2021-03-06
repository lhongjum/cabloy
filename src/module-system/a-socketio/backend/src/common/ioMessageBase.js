module.exports = ctx => {
  class IOMessageBase {

    async onSessionId({ /* path,*/ message /* options*/ }) {
      const userIdFrom = message.userIdFrom;
      const userIdTo = message.userIdTo;
      return message.messageGroup ? userIdTo : this._combineSessionId(userIdFrom, userIdTo);
    }

    async onGroupUsers(/* { path, message, options }*/) {
      return null;
    }

    async onProcess({ path, options, message, messageSyncs, groupUsers, messageClass }) {
      return await ctx.bean.io._onProcessBase({ path, options, message, messageSyncs, groupUsers, messageClass });
    }

    async onSaveSyncs({ path, options, message, groupUsers, messageClass }) {
      return await ctx.bean.io._onSaveSyncs({ path, options, message, groupUsers, messageClass });
    }

    async onPush({ options, message, messageSync, messageClass }) {
      return await ctx.bean.io.push({ options, message, messageSync, messageClass });
    }

    async onDelivery({ path, options, message, messageSync, messageClass }) {
      return await ctx.bean.io.delivery({ path, options, message, messageSync, messageClass });
    }

    async onChannelRender(/* { channelFullName, options, message, messageSync, messageClass }*/) {
      return null;
    }

    async publish({ path, message, messageClass, options }) {
      return await ctx.bean.io.publish({ path, message, messageClass, options });
    }

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IOMessageBase;
};
