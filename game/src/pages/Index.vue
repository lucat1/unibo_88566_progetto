<template>
  <div class="container">
    <aside class="menu">
      <p class="menu-label">Services</p>
      <ul class="menu-list">
        <li><router-link to="/offers">Offers</router-link></li>
        <li><router-link to="/trivia">Trivia</router-link></li>
        <li><router-link to="/videos">Videos</router-link></li>
        <li><router-link to="/help">Help</router-link></li>
      </ul>
      <p class="menu-label">Games</p>
      <ul class="menu-list">
        <li><router-link to="/leaderboard/quiz">Leaderboards</router-link></li>
        <li><router-link to="/quiz">Quiz</router-link></li>
        <li><router-link to="/memory">Memory</router-link></li>
        <li><router-link to="/hangman">Hangman</router-link></li>
        <li><router-link to="/spot">Spot</router-link></li>
      </ul>
    </aside>
  </div>
</template>
