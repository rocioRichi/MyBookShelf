<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchBooks } from "../api/books";
import type { Book } from "../types";

const items = ref<Book[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 10;
const loading = ref(false);
const error = ref<string | null>(null);

// filtros de búsqueda
const searchTitle = ref("");
const searchAuthor = ref("");

// orden
const sortField = ref<"title" | "published" | "stock" | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

// cargar datos
async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetchBooks(
      page.value,
      pageSize,
      { title: searchTitle.value, author: searchAuthor.value },
      { field: sortField.value || undefined, order: sortOrder.value }
    );
    items.value = res.data;
    total.value = res.total;
  } catch (e) {
    error.value = "No se pudo cargar el listado";
  } finally {
    loading.value = false;
  }
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize))
);

function goPrev() {
  if (page.value > 1) {
    page.value--;
    load();
  }
}
function goNext() {
  if (page.value < totalPages.value) {
    page.value++;
    load();
  }
}

function doSearch() {
  page.value = 1;
  load();
}

function setSort(field: "title" | "published" | "stock") {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
  page.value = 1;
  load();
}
// function ariaSortFor(field: "title" | "published" | "stock") {
//   if (sortField.value !== field) return "none";
//   return sortOrder.value === "asc" ? "ascending" : "descending";
// }

onMounted(load);
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-3">Libros</h1>

    <!-- filtros -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="searchTitle"
        placeholder="Buscar por título"
        class="border p-1 rounded"
      />

      <button class="px-3 py-1 border rounded bg-blue-100" @click="doSearch">
        Buscar
      </button>
    </div>

    <p v-if="loading">Cargando…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else>
      <table class="table card p-4">
        <thead>
          <tr>
            <th class="th">Título</th>
            <th class="th">Autor</th>
            <th class="th">
              <button class="nav-link" @click="setSort('published')">
                Publicación
                <span v-if="sortField === 'published'">({{ sortOrder }})</span>
              </button>
            </th>
            <th class="th">Categoría</th>
            <th class="th">
              <button class="nav-link" @click="setSort('stock')">
                Stock
                <span v-if="sortField === 'stock'">({{ sortOrder }})</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in items" :key="b.id" class="row">
            <td class="td">
              <router-link
                :to="`/books/${b.id}`"
                class="underline decoration-[var(--primary)] underline-offset-4 hover:text-[var(--primary)] transition"
              >
                {{ b.title }}
              </router-link>
            </td>
            <td class="td opacity-90">{{ b.author }}</td>
            <td class="td">{{ b.published }}</td>
            <td class="td">
              <span class="chip">{{ b.category }}</span>
            </td>
            <td class="td font-semibold">{{ b.stock }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Controles -->
      <div class="mt-4 flex items-center justify-between">
        <!-- filtros -->
        <div class="flex gap-2">
          <input
            v-model="searchTitle"
            class="input w-56"
            placeholder="Buscar título"
          />

          <button class="btn-ghost" @click="doSearch">Buscar</button>
          <button
            class="btn-ghost"
            @click="
              () => {
                searchTitle = '';
                searchAuthor = '';
                page = 1;
                load();
              }
            "
          >
            Limpiar
          </button>
        </div>

        <!-- paginación -->
        <div class="flex items-center gap-2">
          <button class="btn-ghost" @click="goPrev" :disabled="page <= 1">
            ←
          </button>
          <span class="text-sm text-[var(--muted)]">Página</span>
          <span class="px-2 py-1 rounded-lg bg-white/5">{{ page }}</span>
          <span class="text-sm text-[var(--muted)]">de</span>
          <span class="px-2 py-1 rounded-lg bg-white/5">{{ totalPages }}</span>
          <button
            class="btn-ghost"
            @click="goNext"
            :disabled="page >= totalPages"
          >
            →
          </button>
        </div>
      </div>

      <!-- paginación -->
      <div class="mt-3 flex items-center gap-3 justify-end">
        <button
          class="px-3 py-1 border rounded"
          @click="goPrev"
          :disabled="page <= 1"
        >
          Anterior
        </button>
        <span>Página {{ page }} / {{ totalPages }}</span>
        <button
          class="px-3 py-1 border rounded"
          @click="goNext"
          :disabled="page >= totalPages"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>
