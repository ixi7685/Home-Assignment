<template>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-else-if="loading"><base-spinner></base-spinner></div>
  <div class="wrapper" v-else>
    <section class="workers">
      <h3 class="title">Workers</h3>
      <hr />
      <ul v-for="worker in workers" :key="worker.id">
        <li>
          <h4
            class="header_padding"
            :class="{ highlight: worker.id == activeWorker }"
            @click="activeWorker = worker.id"
          >
            {{ worker.name }}
          </h4>
        </li>
      </ul>
    </section>
    <section class="flights" v-if="flights">
      <div>
        <table>
          <tr>
            <th>Flight Number</th>
            <th>Origin</th>
            <th>Origin Date</th>
            <th>Destination</th>
            <th>Destination Date</th>
          </tr>

          <tbody>
            <tr
              v-for="flight in flights"
              :key="flight.num"
              @click="flight_info = flight"
              :class="{
                highlight: flight_info && flight.num == flight_info.num
              }"
            >
              <td>{{ flight.num }}</td>
              <td>{{ flight.origin }}</td>
              <td>{{ flight.origin_date }}</td>
              <td>{{ flight.destination }}</td>
              <td>{{ flight.destination_date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="info">
      <div class="info_wrapper">
        <div class="titles">
          <div>Plane number</div>
          <div>Duration</div>
          <div>Origin gate</div>
          <div>Destination gate</div>
        </div>
        <div class="values" v-if="flight_info">
          <div>{{ flight_info.plane }}</div>
          <div>{{ formatedTime }}</div>
          <div>{{ flight_info.origin_gate }}</div>
          <div>{{ flight_info.destination_gate }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workers: [],
      activeWorker: null,
      flights: [],
      flight_info: null,
      loading: false,
      id: '',
      timer: '',
      error: null
    };
  },
  methods: {
    async getWorkers() {
      this.loading = true;

      const response = await fetch(
        `https://interview-mock.herokuapp.com/api/workers/`
      );
      const responseData = await response.json();

      if (!response) {
        this.loading = false;
        this.error = 'Failed to fetch, try again later!';
      }

      let workersArr = [];
      for (const workersss of responseData) {
        const worker = {
          id: workersss.id,
          name: workersss.name
        };
        workersArr.push(worker);
      }

      this.workers = workersArr;
      this.loading = false;
    },

    async loadFlights(id) {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(this.loadFlightsInterval, 60000);

      this.id = id;

      const response = await fetch(
        `https://interview-mock.herokuapp.com/api/workers/${id}`
      );
      const responseData = await response.json();

      if (!response) {
        this.error = 'Failed to fetch, try again later!';
      }

      this.flights = [];

      let flightArr = [];
      for (const flightss of responseData) {
        const flight = {
          num: flightss.num,
          origin: flightss.from,
          origin_date: flightss.from_date,
          origin_gate: flightss.from_gate,
          destination: flightss.to,
          destination_date: flightss.to_date,
          destination_gate: flightss.to_gate,
          duration: flightss.duration,
          plane: flightss.plane
        };
        flightArr.push(flight);
      }
      this.flights = flightArr;

      if (this.flight_info == null) {
        this.flight_info = flightArr[0];
      }
    },

    loadFlightsInterval() {
      this.loadFlights(this.id);
    }
  },
  computed: {
    formatedTime() {
      let fTime = '';

      if (typeof this.flight_info.duration != 'string') {
        let h = Math.floor(this.flight_info.duration / 60);
        let m = this.flight_info.duration % 60;
        h = h < 10 ? h : h;
        m = m < 10 ? m : m;

        if (m > 0) {
          fTime = `${h}h ${m}m`;
        } else {
          fTime = `${h}h`;
        }
      }
      return fTime;
    }
  },
  watch: {
    workers(val) {
      this.activeWorker = val[0].id;
    },

    activeWorker(val) {
      this.activeFlight = null;
      this.flight_info = null;
      this.loadFlights(val);
    },

    flights(val) {
      let flight = val.filter(flight => flight.num === this.flight_info.num);
      this.flight_info = flight[0];
    }
  },

  created() {
    this.getWorkers();
  }
};
</script>

<style scoped>
.error {
  margin: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 30px;
  color: #3d008d;
}

.title {
  color: #4f8c00;
}

ul {
  list-style: none;
  padding: 0;
  cursor: pointer;
}

.header_padding {
  padding: 2px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.highlight {
  background-color: #dcdcdc;
}

.flight_info {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.info {
  margin: 0 5%;
  padding: 25px;
  min-width: 22%;

  border: 1px solid #3d008d;
}

.info_wrapper {
  display: flex;
  justify-content: space-between;
}
.titles {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.values {
  display: flex;
  flex-direction: column;
  max-width: 100px;
}

.flights {
  padding: 20px;
  min-width: 45%;
  border: 1px solid #3d008d;
}

.workers {
  margin: 0 5%;
  padding: 0px 5px;
  min-width: 11%;
  border: 1px solid #3d008d;
}

.wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 5%;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    #4f8c00,
    rgba(0, 0, 0, 0)
  );
}

@media only screen and (max-width: 1150px) {
  .wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    margin: 5%;
  }

  .flights {
    border: none;
    width: 100%;
  }

  .info {
    border: none;
    width: 65%;
    margin-left: 0px;
  }

  .workers {
    border: none;
  }
}
</style>
