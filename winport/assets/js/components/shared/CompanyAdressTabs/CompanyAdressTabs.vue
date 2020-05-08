<style src="./CompanyAdressTabs.scss" lang="scss" scoped></style>
<script>
import AddPhone from '@/components/shared/AddPhone/AddPhone.vue'
import {ClickOutside} from '@/directives/click-outside'
import FormElementError from '@/components/shared/FormElementError/FormElementError.vue'
const {yandexMap, ymapMarker} = require('vue-yandex-maps')

export default {
  name: 'CompanyAdressTabs',

  template: require('./CompanyAdressTabs.html'),

  directives: {ClickOutside},

  components: {
    yandexMap,
    ymapMarker,
    'add-phone': AddPhone,
    'form-element-error': FormElementError
  },

  props: ['errors', 'branches'],

  data: () => {
    return {
      tabs: ['Основной'],
      tabName: '',
      tabNameAdd: false,
      selectedTab: 0,
      ymapCenterCoords: [],
      ymapZoom: [],
      placemarkCoords: [],
      placemarkId: [],
      selectedCountry: [],
      selectedCity: [],
      address: [],
      zip: [],
      coords: [],
      cities: [],
      countries: [],
      branch_id: [],

      city: [],
      district: [],
      region: [],

      mode: 'new',

      coordsStorage: [],

      contacts: [
        {
          email: {
            value: '',
            displayAtSite: false
          },
          site: '',
          phones: [
            {
              value: '',
              type: 'Телефон'
            }
          ]
        }
      ],

      workingTime: [
        {
          monday: {
            type: 'Рабочий день',
            startTime: null,
            endTime: null
          },
          tuesday: {
            type: 'Рабочий день',
            startTime: null,
            endTime: null
          },
          wednesday: {
            type: 'Рабочий день',
            startTime: null,
            endTime: null
          },
          thursday: {
            type: 'Рабочий день',
            startTime: null,
            endTime: null
          },
          friday: {
            type: 'Рабочий день',
            startTime: null,
            endTime: null
          },
          saturday: {
            type: 'Выходной',
            startTime: null,
            endTime: null
          },
          sunday: {
            type: 'Выходной',
            startTime: null,
            endTime: null
          }
        }
      ],

      displayWorkTime: false,
      workTimeX: 0,
      workTimeY: 0,
      workTimeStep: 1,
      workTimeType: null,
      workTimeStart: null,
      workTimeEnd: null,
      workTimeDay: null,
      workStartIndex: null,
      isLeftWorkingTime: true,
      isRighterWorking: false,
      yandexMapVisible: true,
      yandexMapHide: false
    }
  },

  mounted () {
    this.initInitialTab(this.selectedTab)
    this.fetchData()
  },

  methods: {
    isErrorExistsAtTab (tabIndex) {
      if (typeof this.errors.error_tabs !== 'undefined') {
        return this.errors.error_tabs[0].includes(String(tabIndex))
      }
      return false
    },

    selectWorkingDay () {
      switch (this.workTimeDay) {
        case 'friday':
        case 'saturday':
        case 'sunday':
          this.workTimeX = 229
          this.isRighterWorking = true
      }
      this.workingTime[this.selectedTab][this.workTimeDay].type = 'Рабочий день'
      this.workTimeStep = 2
    },

    selectWeekend () {
      this.workingTime[this.selectedTab][this.workTimeDay].type = 'Выходной'
      this.displayWorkTime = false
    },

    selectDayStart (index) {
      this.workingTime[this.selectedTab][this.workTimeDay].startTime = this.dayTimes[index]
      this.workStartIndex = index
      this.workTimeStep = 3
    },

    selectDayEnd (index) {
      if (index <= this.workStartIndex) {
        return
      }
      this.workingTime[this.selectedTab][this.workTimeDay].endTime = this.dayTimes[index]
      this.displayWorkTime = false
    },

    selectRoundTheClock () {
      this.workingTime[this.selectedTab][this.workTimeDay].type = 'Круглосуточно'
      this.displayWorkTime = false
    },

    showWorkTime (day, $event) {
      let $child = $($event.target)
      let childTop = $child.offset().top
      let parentTop = $child.closest('.tab-content').offset().top
      let height = $child.closest('tr').height()
      this.workTimeY = childTop - parentTop + height
      this.workTimeStep = 1
      this.workTimeType = this.workingTime[this.selectedTab][day].type
      this.workTimeStart = this.workingTime[this.selectedTab][day].startTime
      this.workTimeEnd = this.workingTime[this.selectedTab][day].endTime
      this.workTimeDay = day
      this.isRighterWorking = false
      switch (day) {
        case 'monday':
          this.workTimeX = 132
          this.isLeftWorkingTime = true
          break
        case 'tuesday':
          this.workTimeX = 132
          this.isLeftWorkingTime = true
          break
        case 'wednesday':
          this.workTimeX = 132
          this.isLeftWorkingTime = true
          break
        case 'thursday':
          this.workTimeX = 132
          this.isLeftWorkingTime = true
          break
        case 'friday':
          this.workTimeX = 489
          this.isLeftWorkingTime = false
          break
        case 'saturday':
          this.workTimeX = 489
          this.isLeftWorkingTime = false
          break
        case 'sunday':
          this.workTimeX = 489
          this.isLeftWorkingTime = false
          break
      }
      this.displayWorkTime = true
    },

    closeWorkingTime: function (event) {
      this.displayWorkTime = false
    },

    addPhone () {
      if (this.contacts[this.selectedTab].phones.length >= 5) {
        return
      }
      let newPhone = {
        value: '',
        type: 'Телефон'
      }
      this.contacts[this.selectedTab].phones.push(newPhone)
    },

    deletePhone (index) {
      if (this.contacts[this.selectedTab].phones.length === 1) return
      this.contacts[this.selectedTab].phones.splice(index, 1)
    },

    assignCompanyPhone (phone) {
      this.contacts[this.selectedTab].phones[phone.index] = {
        value: phone.value,
        type: phone.type
      }
      this.sendContactsToParent()
    },

    getDefaultCoords: function () {
      return [53.9, 27.56667]
    },

    initInitialTab (index) {
      this.$set(this.ymapCenterCoords, index, this.getDefaultCoords())
      this.$set(this.ymapZoom, index, 8)
      this.$set(this.placemarkCoords, index, this.getDefaultCoords())
      this.$set(this.placemarkId, index, 'placemark' + index)
      this.$set(this.selectedCountry, index, null)
      this.$set(this.selectedCity, index, null)
      this.$set(this.address, index, '')
      this.$set(this.zip, index, '')
      this.$set(this.coords, index, this.getDefaultCoords())
      this.$set(this.branch_id, index, false)

      let newContacts = {
        email: {
          value: '',
          displayAtSite: false
        },
        site: '',
        phones: [
          {
            value: '',
            type: 'Телефон'
          }
        ]
      }

      this.$set(this.contacts, index, newContacts)

      let newSchedule = {
        monday: {
          type: 'Рабочий день',
          startTime: null,
          endTime: null
        },
        tuesday: {
          type: 'Рабочий день',
          startTime: null,
          endTime: null
        },
        wednesday: {
          type: 'Рабочий день',
          startTime: null,
          endTime: null
        },
        thursday: {
          type: 'Рабочий день',
          startTime: null,
          endTime: null
        },
        friday: {
          type: 'Рабочий день',
          startTime: null,
          endTime: null
        },
        saturday: {
          type: 'Выходной',
          startTime: null,
          endTime: null
        },
        sunday: {
          type: 'Выходной',
          startTime: null,
          endTime: null
        }
      }

      this.$set(this.workingTime, index, newSchedule)
    },

    initBranchTab (index) {
      let address = this.branches.addresses[index]
      let contact = this.branches.contacts[index]
      let workingTime = this.branches.workingTime[index]

      this.$set(this.tabs, index, address.name)

      this.yandexMapVisible = false

      this.$set(this.selectedCountry, index, {label: address.selectedCountryLabel, value: -1})
      this.$set(this.city, index, address.city)
      this.$set(this.district, index, address.district)
      this.$set(this.region, index, address.region)
      this.$set(this.selectedCity, index, {label: address.selectedCityLabel, value: -1})
      this.$set(this.address, index, address.address)
      this.$set(this.zip, index, address.zip)
      this.$set(this.coords, index, [address.coords[0], address.coords[1]])
      this.$set(this.branch_id, index, address.branch_id)
      let currentAddress = address.selectedCountryLabel + ', ' + address.selectedCityLabel + ', ' + address.address
      if (address.coords[0].length && address.coords[1].length) {
        this.coordsStorage[currentAddress] = [address.coords[0], address.coords[1]]
        setTimeout(() => {
          this.$set(this.ymapCenterCoords, index, [address.coords[0], address.coords[1]])
          this.$set(this.ymapZoom, index, 16)
          this.$set(this.placemarkCoords, index, [address.coords[0], address.coords[1]])
          this.$set(this.placemarkId, index, 'placemark' + index)

          this.yandexMapVisible = true
        }, 500)
      } else {
        this.yandexMapVisible = true
      }

      this.$set(this.contacts, index, {
        phones: [],
        site: '',
        email: {value: '', displayAtSite: false}
      })

      let that = this
      setTimeout(function () {
        that.$set(that.contacts[index], 'phones', contact.phones)
        that.$set(that.contacts[index], 'site', contact.site)
        that.$set(that.contacts[index], 'email', contact.email)
      }, 150)

      this.$set(this.workingTime, index, workingTime)
    },

    fetchData () {
      this.$store.dispatch('getCountries').then(() => {
        this.countries = this.$store.getters.getCountries
      })
    },

    fetchCities () {
      if (this.selectedCountry[this.selectedTab].value === 0) {
        return
      }
      this.$store.dispatch('getCities', [this.selectedCountry[this.selectedTab].value]).then(() => {
        this.$set(this.cities, this.selectedTab, this.$store.getters.getCities)
      })
    },

    filterCity (option, label, search) {
      return (label || '').toLowerCase().indexOf(search.toLowerCase()) === 0
    },

    movePoint: function (result, isMovePlacemark) {
      if (result.length) {
        this.$set(this.coords, this.selectedTab, result)
        this.$set(this.ymapCenterCoords, this.selectedTab, result)
        if (isMovePlacemark) {
          this.currentPlacemarkCoords = result
          this.currentYmapZoom = 16
        }
        this.extractZipFromCoords()
      }
    },

    moveYandexPlacemark (address, isMovePlacemark) {
      if (typeof this.coordsStorage[address] === 'undefined') {
        this.$store.dispatch('getGeocode', address).then(() => {
          let result = this.$store.getters.getGeocode
          this.movePoint(result, isMovePlacemark)
          this.coordsStorage[address] = result
        })
      } else {
        this.movePoint(this.coordsStorage[address], isMovePlacemark)
      }
    },

    extractZipFromCoords () {
      this.$store.dispatch('getGeocodeByCoords', this.currentCoords).then(() => {
        if ((typeof this.$store.getters.getZip !== 'undefined') && (this.$store.getters.getZip.length > 0)) {
          this.$set(this.zip, this.selectedTab, this.$store.getters.getZip)
        }

        if ((this.currentSelectedCity === null) || (this.currentSelectedCountry == null)) {
          return
        }

        if (this.currentSelectedCountry.value === 0) {
          let countryObject = {label: this.$store.getters.getCountry, value: 0}
          if (countryObject.label !== this.currentSelectedCountry.label) {
            this.$set(this.selectedCountry, this.selectedTab, countryObject)
          }
        }

        if (this.currentSelectedCity.value === 0) {
          let address = []
          let district = this.$store.getters.getDistrict
          let region = this.$store.getters.getRegion
          let city = this.$store.getters.getCity
          if ((city !== null) && (city.length > 0)) {
            this.$set(this.city, this.selectedTab, city)
            address.push(city)
          }
          if ((region !== null) && (address.indexOf(region) === -1) && (region.length > 0)) {
            this.$set(this.region, this.selectedTab, region)
            address.push(region)
          }
          if ((district !== null) && (address.indexOf(district) === -1) && (district.length > 0)) {
            this.$set(this.district, this.selectedTab, district)
            address.push(district)
          }
          let cityObject = {label: address.join(', '), value: 0}
          if (cityObject.label !== this.currentSelectedCity.label) {
            this.$set(this.selectedCity, this.selectedTab, cityObject)
          }
        }
      })
    },

    extractAddressFromCoords () {
      this.$store.dispatch('getGeocodeByCoords', this.currentCoords).then(() => {
        this.$set(this.zip, this.selectedTab, this.$store.getters.getZip)

        if (this.$store.getters.getAddress.length > 0) {
          this.$set(this.address, this.selectedTab, this.$store.getters.getAddress)
        }

        if ((this.currentSelectedCountry === null) || (this.currentSelectedCountry.value === 0)) {
          let countryObject = {label: this.$store.getters.getCountry, value: -1}
          this.$set(this.selectedCountry, this.selectedTab, countryObject)
        }

        if ((this.currentSelectedCity === null) || (this.currentSelectedCity.value === 0)) {
          let address = []
          let district = this.$store.getters.getDistrict
          let region = this.$store.getters.getRegion
          let city = this.$store.getters.getCity
          if ((city !== null) && (city.length > 0)) {
            this.$set(this.city, this.selectedTab, city)
            address.push(city)
          }
          if ((region !== null) && (address.indexOf(region) === -1) && (region.length > 0)) {
            this.$set(this.region, this.selectedTab, region)
            address.push(region)
          }
          if ((district !== null) && (address.indexOf(district) === -1) && (district.length > 0)) {
            this.$set(this.district, this.selectedTab, district)
            address.push(district)
          }
          let cityObject = {label: address.join(', '), value: -1}
          this.$set(this.selectedCity, this.selectedTab, cityObject)
        }
      })
    },

    changePosition (result) {
      let currentCoords = result.originalEvent.target.geometry.getCoordinates()
      let address = null
      if (this.currentAddress.length > 0) {
        address = this.currentSelectedCountry.label + ', ' + this.currentSelectedCity.label + ', ' + this.currentAddress
      } else if (this.currentSelectedCity !== null) {
        address = this.currentSelectedCountry.label + ', ' + this.currentSelectedCity.label
      } else if (this.currentSelectedCountry !== null) {
        address = this.currentSelectedCountry.label
      }
      if (address !== null) {
        this.coordsStorage[address] = currentCoords
      }
      this.$set(this.coords, this.selectedTab, currentCoords)
      this.sendAddressToParent()
      this.extractAddressFromCoords()
    },

    removeTab (index) {
      // let index = this.selectedTab;
      this.tabs.splice(index, 1)
      this.ymapCenterCoords.splice(index, 1)
      this.ymapZoom.splice(index, 1)
      this.placemarkCoords.splice(index, 1)
      this.placemarkId.splice(index, 1)
      this.selectedCountry.splice(index, 1)
      this.selectedCity.splice(index, 1)
      this.address.splice(index, 1)
      this.zip.splice(index, 1)
      this.coords.splice(index, 1)
      this.cities.splice(index, 1)
      this.contacts.splice(index, 1)
      this.workingTime.splice(index, 1)
      this.selectedTab = index - 1
    },

    addTabName () {
      this.tabNameAdd = true
    },

    disableAdding () {
      this.tabNameAdd = false
    },

    addTab () {
      if (!(this.tabName)) {
        return
      }

      this.tabs.push(this.tabName)
      this.initInitialTab(this.tabs.length - 1)
      this.selectedTab = this.tabs.length - 1
      this.tabName = ''
      this.tabNameAdd = false
    },

    updateSelected (index) {
      this.selectedTab = index
      this.$forceUpdate()
    },

    sendAddressToParent () {
      let addresses = []
      for (let i = 0; i < this.tabs.length; i++) {
        let selectedCityId = ''
        let selectedCityLabel = ''
        let selectedCountryId = ''
        let selectedCountryLabel = ''

        if (this.selectedCity[i] !== null) {
          selectedCityId = this.selectedCity[i].value
          selectedCityLabel = this.selectedCity[i].label
        }

        if (this.selectedCountry[i] !== null) {
          selectedCountryId = this.selectedCountry[i].value
          selectedCountryLabel = this.selectedCountry[i].label
        }

        addresses[i] = {
          coords: this.coords[i],
          selectedCityId: selectedCityId,
          selectedCityLabel: selectedCityLabel,
          selectedCountryId: selectedCountryId,
          selectedCountryLabel: selectedCountryLabel,
          address: this.address[i],
          city: this.city[i],
          district: this.district[i],
          region: this.region[i],
          zip: this.zip[i],
          name: this.tabs[i],
          branch_id: this.branch_id[i]
        }
      }

      this.$emit('company-address', addresses)
    },

    sendContactsToParent () {
      this.$emit('company-contacts', this.contacts)
    },

    sendWorkingTimeToParent () {
      this.$emit('company-time', this.workingTime)
    },

    onChangeCountry (val) {
      if (val === null) {
        return
      }
      let fakeCountry
      if (typeof val.value === 'undefined') {
        fakeCountry = {value: 0, label: val.label}
      } else if (val.value === -1) {
        return
      } else {
        fakeCountry = val
      }
      this.$set(this.selectedCountry, this.selectedTab, fakeCountry)
      this.$set(this.cities, this.selectedTab, [])
      this.$set(this.address, this.selectedTab, '')
      this.$set(this.zip, this.selectedTab, '')
      this.$set(this.selectedCity, this.selectedTab, null)
      this.$set(this.ymapZoom, this.selectedTab, 8)

      this.initMoveMap()
      this.fetchCities()
    },

    onChangeCity (val) {
      if (val === null) {
        return
      }
      let fakeCity, regionName, districtName, cityName
      if (typeof val !== 'string') {
        cityName = val.label
      } else {
        cityName = val
      }
      if (typeof val.value === 'undefined') {
        fakeCity = {value: 0, label: cityName}
        regionName = '-'
        districtName = '-'
      } else if (val.value <= 0) {
        return
      } else {
        fakeCity = val
        cityName = val.cityName
        regionName = val.regionName
        districtName = val.districtName
      }
      this.$set(this.selectedCity, this.selectedTab, fakeCity)
      this.$set(this.city, this.selectedTab, cityName)
      this.$set(this.region, this.selectedTab, regionName)
      this.$set(this.district, this.selectedTab, districtName)
      this.$set(this.address, this.selectedTab, '')
      this.$set(this.zip, this.selectedTab, '')

      this.initMoveMap()
    },

    initMoveMap: function () {
      if (this.currentAddress.length > 0) {
        let address = this.currentSelectedCountry.label + ', ' + this.currentSelectedCity.label + ', ' + this.currentAddress
        this.moveYandexPlacemark(address, true)
      } else if (this.currentSelectedCity !== null) {
        let address = this.currentSelectedCountry.label + ', ' + this.currentSelectedCity.label
        this.moveYandexPlacemark(address, false)
      } else if (this.currentSelectedCountry !== null) {
        this.moveYandexPlacemark(this.currentSelectedCountry.label, false)
      }
    },

    currentDaySchedule (day) {
      if (this.workingTime[this.selectedTab][day].type === 'Выходной') {
        return 'Выходной'
      }
      if (this.workingTime[this.selectedTab][day].type === 'Круглосуточно') {
        return 'Круглосуточно'
      }
      if (this.workingTime[this.selectedTab][day].type === 'Рабочий день') {
        let result
        if (this.workingTime[this.selectedTab][day].startTime !== null) {
          result = this.workingTime[this.selectedTab][day].startTime
          if (this.workingTime[this.selectedTab][day].endTime !== null) {
            result += ' - ' + this.workingTime[this.selectedTab][day].endTime
          }
        }
        return result
      }
    }
  },

  computed: {
    currentMonday () {
      return this.currentDaySchedule('monday')
    },

    currentTuesday () {
      return this.currentDaySchedule('tuesday')
    },

    currentWednesday () {
      return this.currentDaySchedule('wednesday')
    },

    currentThursday () {
      return this.currentDaySchedule('thursday')
    },

    currentFriday () {
      return this.currentDaySchedule('friday')
    },

    currentSaturday () {
      return this.currentDaySchedule('saturday')
    },

    currentSunday () {
      return this.currentDaySchedule('sunday')
    },

    currentPlaceholder () {
      if (this.selectedTab === 0) {
        return 'Введите адрес сайта'
      }

      return 'Сайт можно установить только у основного офиса'
    },

    dayTimes () {
      let options = []
      for (let i = 0; i <= 23; i++) {
        for (let j = 0; j < 60; j += 30) {
          let iPrint = (i < 10) ? '0' + i : i
          let jPrint = (j < 10) ? '0' + j : j
          options.push(iPrint + ':' + jPrint)
        }
      }
      return options
    },

    currentCities () {
      return this.cities[this.selectedTab]
    },

    currentPlacemarks () {
      return [{
        coords: this.currentPlacemarkCoords,
        options: {draggable: true},
        callbacks: {dragend: this.changePosition}
      }]
    },

    currentSelectedCountry: {
      get: function () {
        return this.selectedCountry[this.selectedTab]
      },
      set: function (newValue) {
        this.selectedCountry[this.selectedTab] = newValue
      }
    },

    currentTabEmail: {
      get: function () {
        return this.contacts[this.selectedTab].email.value
      },
      set: function (newValue) {
        this.contacts[this.selectedTab].email.value = newValue
      }
    },

    currentTabEmailDisplay: {
      get: function () {
        return this.contacts[this.selectedTab].email.displayAtSite
      },
      set: function (newValue) {
        this.contacts[this.selectedTab].email.displayAtSite = newValue
      }
    },

    currentSelectedCity: {
      get: function () {
        return this.selectedCity[this.selectedTab]
      },
      set: function (newValue) {
        this.selectedCity[this.selectedTab] = newValue
      }
    },

    currentCoords () {
      if ((this.coords[this.selectedTab][0].length == 0) || (this.coords[this.selectedTab][1].length == 0)) {
        this.initMoveMap()
      }
      return this.coords[this.selectedTab]
    },

    currentYmapCenterCoords () {
      if (typeof this.ymapCenterCoords[this.selectedTab] !== 'undefined') {
        return this.ymapCenterCoords[this.selectedTab]
      }
      return this.getDefaultCoords()
    },

    currentYmapZoom: {
      get: function () {
        return this.ymapZoom[this.selectedTab]
      },
      set: function (newValue) {
        this.$set(this.ymapZoom, this.selectedTab, newValue)
      }
    },

    currentPlacemarkId () {
      return this.placemarkId[this.selectedTab]
    },

    currentPlacemarkCoords: {
      get: function () {
        return this.placemarkCoords[this.selectedTab]
      },
      set: function (newValue) {
        this.$set(this.placemarkCoords, this.selectedTab, newValue)
      }
    },

    currentAddress: {
      get: function () {
        return this.address[this.selectedTab]
      },
      set: function (newValue) {
        this.$set(this.address, this.selectedTab, newValue)
      }
    },

    currentZip: {
      get: function () {
        return this.zip[this.selectedTab]
      },
      set: function (newValue) {
        this.$set(this.zip, this.selectedTab, newValue)
      }
    },

    currentAddressesErrors () {
      let propName = 'addresses_' + this.selectedTab
      return this.errors[propName]
    },

    currentEmailErrors () {
      let propName = 'email_' + this.selectedTab
      return this.errors[propName]
    },

    currentWebsiteErrors () {
      let propName = 'website_' + this.selectedTab
      return this.errors[propName]
    },

    currentPhoneErrors () {
      let propName = 'phone_0_' + this.selectedTab
      return this.errors[propName]
    },

    currentWorkingTimeErrors () {
      let propName = 'workingTime_' + this.selectedTab
      return this.errors[propName]
    },
    currentZipErrors () {
      let propName = 'zip_' + this.selectedTab
      return this.errors[propName]
    },
    currentTabPhones () {
      return this.contacts[this.selectedTab].phones
    }
  },

  watch: {
    branches: function () {
      for (let i in this.branches.addresses) {
        this.initBranchTab(i)
      }
    },

    currentAddress: function () {
      this.sendAddressToParent()
      this.initMoveMap()
    },

    currentSelectedCity: function () {
      this.sendAddressToParent()
    },

    currentSelectedCountry: function () {
      this.sendAddressToParent()
    },

    currentZip: function () {
      this.sendAddressToParent()
    },

    contacts: {
      handler: function (val, oldVal) {
        this.sendContactsToParent()
      },
      deep: true
    },

    workingTime: {
      handler: function (val, oldVal) {
        this.sendWorkingTimeToParent()
      },
      deep: true
    }
  }
}
</script>
