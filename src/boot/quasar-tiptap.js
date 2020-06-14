import Vue from 'vue'
import { QuasarTiptapPlugin } from 'quasar-tiptap'

Vue.use(QuasarTiptapPlugin, {
  language: 'en-us',
  spellcheck: true
})

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue ... } */) => {
  // something to do
}
