<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBook, updateBook } from "../api/books";
import type { Book } from "../types";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

// modelo
const form = ref<Book>({
  title: "",
  author: "",
  published: "",
  category: "",
  stock: 0,
});

// cargar datos existentes
const loading = ref(true);
const loadError = ref<string | null>(null);
onMounted(async () => {
  try {
    const b = await getBook(id);
    form.value = { ...b };
  } catch (e) {
    loadError.value = "No se pudo cargar el libro";
  } finally {
    loading.value = false;
  }
});

// validaciones (mismo criterio que /new)
const errors = ref<{ [K in keyof Book]?: string }>({});
const categories = ["Ficción", "No ficción", "Software", "Ciencia", "Historia"];

function validateField<K extends keyof Book>(k: K) {
  const v = form.value[k] as any;
  switch (k) {
    case "title":
    case "author":
      errors.value[k] =
        typeof v === "string" && v.trim().length >= 3
          ? ""
          : "Mínimo 3 caracteres";
      break;
    case "published": {
      const today = new Date().toISOString().slice(0, 10);
      errors.value.published =
        v && v <= today ? "" : "La fecha no puede ser futura";
      break;
    }
    case "category":
      errors.value.category = v ? "" : "Elige una categoría";
      break;
    case "stock":
      errors.value.stock = Number.isInteger(v) && v >= 0 ? "" : "Entero ≥ 0";
      break;
  }
}
function validateAll() {
  (
    ["title", "author", "published", "category", "stock"] as (keyof Book)[]
  ).forEach(validateField);
}
function isValid() {
  return ["title", "author", "published", "category", "stock"].every(
    (k) => !errors.value[k as keyof Book]
  );
}

// acciones
const sending = ref(false);
const submitError = ref<string | undefined>(undefined);

async function onSave() {
  validateAll();
  if (!isValid()) return;
  sending.value = true;
  submitError.value = undefined;
  try {
    await updateBook(id, form.value);
    router.push(`/books/${id}`); // volver al detalle
  } catch (e) {
    submitError.value = "No se pudo guardar";
  } finally {
    sending.value = false;
  }
}

// modal “Descartar”
const showDiscard = ref(false);
function onCancel() {
  showDiscard.value = true;
}
function confirmDiscard() {
  router.push(`/books/${id}`);
}
function closeDiscard() {
  showDiscard.value = false;
}
</script>

<template>
  <div class="p-4 max-w-xl">
    <router-link to="/books" class="inline-block mb-4 underline"
      >← Volver al listado</router-link
    >

    <h1 class="text-xl font-bold mb-4">Editar libro</h1>

    <p v-if="loading">Cargando…</p>
    <p v-else-if="loadError" class="text-red-600">{{ loadError }}</p>

    <form v-else @submit.prevent="onSave" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Título</label>
        <input
          class="border rounded p-2 w-full"
          v-model.trim="form.title"
          @input="validateField('title')"
        />
        <p v-if="errors.title" class="text-red-600 text-sm">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm mb-1">Autor</label>
        <input
          class="border rounded p-2 w-full"
          v-model.trim="form.author"
          @input="validateField('author')"
        />
        <p v-if="errors.author" class="text-red-600 text-sm">
          {{ errors.author }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-sm mb-1">Publicación</label>
          <input
            type="date"
            class="border rounded p-2 w-full"
            v-model="form.published"
            @input="validateField('published')"
          />
          <p v-if="errors.published" class="text-red-600 text-sm">
            {{ errors.published }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">Categoría</label>
          <select
            class="border rounded p-2 w-full"
            v-model="form.category"
            @change="validateField('category')"
          >
            <option value="" disabled>Selecciona…</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="errors.category" class="text-red-600 text-sm">
            {{ errors.category }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">Stock</label>
          <input
            type="number"
            min="0"
            step="1"
            class="border rounded p-2 w-full"
            v-model.number="form.stock"
            @input="validateField('stock')"
          />
          <p v-if="errors.stock" class="text-red-600 text-sm">
            {{ errors.stock }}
          </p>
        </div>
      </div>

      <div class="flex gap-2 justify-end pt-2">
        <button
          type="button"
          class="px-3 py-2 border rounded"
          @click="onCancel"
        >
          Descartar
        </button>
        <button
          type="submit"
          class="px-3 py-2 rounded text-black bg-gray-200"
          :class="
            isValid()
              ? 'bg-black text-black bg-gray-200'
              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
          "
          :disabled="!isValid() || sending"
        >
          {{ sending ? "Guardando…" : "Guardar" }}
        </button>
      </div>

      <p v-if="submitError" class="text-red-600 text-sm mt-2">
        {{ submitError }}
      </p>
    </form>

    <!-- Modal de confirmación -->
    <div
      v-if="showDiscard"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      @click.self="closeDiscard"
    >
      <div
        class="bg-white rounded-lg p-4 w-full max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-title"
        tabindex="-1"
        autofocus
      >
        <h2 id="discard-title" class="text-lg font-semibold">
          Descartar cambios
        </h2>
        <p class="mt-2 text-sm">Perderás los cambios no guardados.</p>
        <div class="mt-4 flex justify-end gap-2">
          <button class="px-3 py-2 border rounded" @click="closeDiscard">
            Cancelar
          </button>
          <button
            class="px-3 py-2 rounded bg-red-600 text-white"
            @click="confirmDiscard"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
