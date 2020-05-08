import { COOKIES_NAMES, PRIVILEGES } from '@/constants'
import { getCookie } from '@/helpers'

export const privilegesMixin = {
  data () {
    return {
      _privileges: []
    }
  },
  computed: {
    warehouseIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.WAREHOUSE)
    },
    filesIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.FILES)
    },
    ordersViewIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.ORDERS_VIEW)
    },
    requestsCreationIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.REQUESTS_CREATION)
    },
    bookingIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.BOOKING)
    },
    bpzApprovalIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.BPZ_APPROVAL)
    },
    modelApprovalIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.MODEL_APPROVAL)
    },
    newsIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.NEWS)
    },
    contactIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.CONTACT)
    },
    forumIsAvailalbe () {
      return this._privileges.some(v => v === PRIVILEGES.FORUM)
    },
    polygraphIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.POLYGRAPH)
    },
    usersCreationIsAvailable () {
      return this._privileges.some(v => v === PRIVILEGES.USERS)
    }
  },
  created () {
    const privileges = decodeURIComponent(getCookie(COOKIES_NAMES.ACCESS)).split(',')
    if (privileges instanceof Array) {
      this._privileges = privileges.slice()
    }
  }
}

export const ordersAndRequestsSearchMixin = {
  data () {
    return {
      searchInputValue: '',
      searchSelectValue: '',
      searchBooleanValue: false
    }
  },
  methods: {
    onSearch () {
      const params = {
        query: this.searchInputValue,
        select: this.searchSelectValue ? this.searchSelectValue : 0,
        booking: this.searchBooleanValue,
        count: 0
      }
      if (params.query === '' && params.select === 0 && params.booking === false) {
        delete params.count
      }
      this.search(params)
    },
    onSearchSelect (value) {
      if (this.searchSelectValue !== value) {
        this.searchSelectValue = value
        this.onSearch()
      }
    },
    onSearchButton () {
      this.searchBooleanValue = !this.searchBooleanValue
      this.onSearch()
    }
  }
}
