<template>

  <div class="container">

    <div class="center">
      <h2>Regionalni lider u tehničkoj zaštiti</h2>
    </div>

    <div class="center">
      <h2>HARDVER <span style="color: #00b16a;">+</span> SOFTVER <span style="color: #00b16a;">+</span> USLUGE <span style="color: #00b16a;">+</span> PLATFORMA </h2>
    </div>

    <Divider></Divider>

    <div class="center">
      <h2>4x iDEA ponude vrijednosti</h2>  
    </div>

    <div class="idea">
      <div class="img">
        <span class="clickable" @click="openLinkInNewTab('https://www.alarmautomatika.com/hr/idea-ponuda-vrijednosti/')">
          <Image src="https://www.alarmautomatika.com/wp-content/uploads/2020/10/idea-express-logo-home-banner.png" alt="Idea Express"/>
          <p style="color: black;"><i style="color: #F39521;"> brza i jednostavna </i> <i>pametna automatizacija</i>  </p>
        </span>
      </div> 

      <div class="img">
        <span class="clickable" @click="openLinkInNewTab('https://www.alarmautomatika.com/hr/idea-ponuda-vrijednosti/')">
          <Image src="https://www.alarmautomatika.com/wp-content/uploads/2020/10/idea-classic-logo-home-banner.png" alt="Idea Classic"/>
          <p style="color: black;"><i style="color: #22986D;"> pouzdana i fleksibilna </i> <i>pametna sigurnost</i>  </p>
        </span>
      </div> 

      <div class="img">
        <span class="clickable" @click="openLinkInNewTab('https://www.alarmautomatika.com/hr/idea-ponuda-vrijednosti/')">
          <Image src="https://www.alarmautomatika.com/wp-content/uploads/2020/10/idea-project-logo-home-banner.png" alt="Idea Project"/>
          <p style="color: black;"><i style="color: #E33E3F;"> napredna i otvorena </i> <i>pametna zaštita od požara</i>  </p>
        </span>
      </div> 

      <div class="img">
        <span class="clickable" @click="openLinkInNewTab('https://www.alarmautomatika.com/hr/idea-ponuda-vrijednosti/')">
          <Image src="https://www.alarmautomatika.com/wp-content/uploads/2020/10/idea-solution-logo-home-banner.png" alt="Idea Solution"/>
          <p style="color: black;"><i style="color: #167ABD;"> jedinstven i cjelovit </i> <i>pametni nadzor</i>  </p>
        </span>
        
      </div> 
    </div>
   
    
  </div>

  <!--
  <div v-if="$store.state.isUserLoggedIn">
    You are logged in.
    <div>{{ $store.state.user.id }}</div>
    <div>{{ $store.state.user.email }}</div>
    <div>{{ $store.state.user.role }}</div>
  </div>
  <div v-else>
    You are NOT logged in.
  </div>
  -->
</template>

<script>

export default {
  name: 'HomeView',
  components: {

  },
  data() {
      return {

      }
  }, 
  methods: {
    openLinkInNewTab(link) {
      window.open(link, '_blank');
    }
  }
}
</script>

<style scoped>

.center{
  display: flex;
  justify-content: space-around;
}

.idea{
  display: flex;
  justify-content: space-around;
}

  
</style>