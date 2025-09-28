<script setup lang="ts">
import Toaster from "./components/Toaster.vue";
</script>

<template>
  <div class="min-h-full">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 bg-[var(--surface)]/70 backdrop-blur border-b border-white/10"
    >
      <div class="container-app flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="size-7 rounded-xl bg-[var(--primary)]"></div>
          <h1 class="text-lg font-semibold">BookShelf</h1>
        </div>
        <nav class="flex items-center gap-2">
          <router-link
            to="/books"
            class="nav-link"
            active-class="nav-link-active"
            >Listado</router-link
          >
          <router-link
            to="/books/new"
            class="nav-link"
            active-class="nav-link-active"
            >Nuevo</router-link
          >
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="container-app py-6 fade-in">
      <router-view />
    </main>

    <Toaster />
  </div>
</template>
