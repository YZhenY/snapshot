import { mapState } from 'vuex';
import numeral from 'numeral';
import get from 'lodash/get';
import prettyMs from 'pretty-ms';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import store from '@/store';
import config from '@/helpers/config';
import { shorten } from '@/helpers/utils';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);
const domainName = window.location.hostname;

export default {
  data() {
    return {
      config
    };
  },
  computed: {
    ...mapState(modules),
    domain() {
      const domains = Object.fromEntries(
        Object.entries(get(store.state, 'app.spaces')).map(space => [get(space[1], 'domain'), space[0]]).filter(a => a[0])
      );
      return domains[domainName];
    }
  },
  methods: {
    _get(object, path, fb) {
      return get(object, path, fb);
    },
    _ms(number) {
      const diff = number * 1e3 - new Date().getTime();
      return prettyMs(diff);
    },
    _numeral(number, format = '(0.[00]a)') {
      return numeral(number).format(format);
    },
    _shorten(str: string, key: any): string {
      if (!str) return str;
      let limit;
      if (typeof key === 'number') limit = key;
      if (key === 'symbol') limit = 6;
      if (key === 'name') limit = 64;
      if (key === 'choice') limit = 12;
      if (limit)
        return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
      return shorten(str);
    },
    _ipfsUrl(ipfsHash: string): string {
      return `https://${process.env.VUE_APP_IPFS_GATEWAY}/ipfs/${ipfsHash}`;
    },
    _explorer(network, str: string, type = 'address'): string {
      return `${networks[network].explorer}/${type}/${str}`;
    }
  }
};
