<template>
  <eb-link :class="buttonClass" :onPerform="onPerformClick">
    <div class="item" v-if="loggedIn">
      <img class="avatar" :src="userAvatar">
    </div>
    <div class="item name" v-if="loggedIn">{{userName}}</div>
    <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
    <div :class="statsUserClass"><eb-stats :stats_params="{module:'a-user', name:'user'}" :stats_color="statsUserColor" :onAdjustValue="onAdjustValue" @change="onChangeStatsUser"></eb-stats></div>
  </eb-link>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ ebLayoutButtonBase ],
    data() {
      return {
        statsUser: null,
      };
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.loggedIn;
      },
      user() {
        return this.$store.state.auth.user;
      },
      userName() {
        let userName = this.user.op.userName;
        if (this.user.op.id !== this.user.agent.id) {
          userName = `${userName}(${this.$text('Agent')})`;
        }
        return userName;
      },
      userAvatar() {
        let avatar = this.user.op.avatar;
        if (!avatar) {
          const configBase = this.$meta.config.modules['a-base'];
          avatar = configBase.user.avatar.default;
        }
        return this.$meta.util.combineImageUrl(avatar, 48);
      },
      buttonClass() {
        return {
          mine: true,
          'button-separator': this.buttonConfig.showSeparator,
        };
      },
      statsUserClass() {
        return {
          item: true,
          'display-none': !this.statsUser || (!this.statsUser['a-user:userRed'] && !this.statsUser['a-user:userOrange']),
        };
      },
      statsUserColor() {
        if (!this.statsUser) return null;
        if (this.statsUser['a-user:userRed']) return 'red';
        if (this.statsUser['a-user:userOrange']) return 'orange';
        return null;
      },
    },
    created() {
      // uniform messages
      const action = {
        actionModule: 'a-message',
        actionComponent: 'uniform',
        name: 'initialize',
      };
      this.$meta.util.performAction({ ctx: this, action }).then(() => {});
    },
    methods: {
      onChangeStatsUser(statsUser) {
        this.statsUser = statsUser;
      },
      onAdjustValue(statsUser) {
        if (!statsUser) return null;
        return statsUser['a-user:userRed'] || statsUser['a-user:userOrange'] || null;
      },
    },
  };
}

</script>
