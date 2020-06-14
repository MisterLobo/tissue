import { colors } from 'quasar'
const { setBrand } = colors

setBrand('bug', '#ff0000')
setBrand('feature', '#ff00ff')
setBrand('documentation', '#facade')
setBrand('wont fix', '#f0f0f0')
setBrand('question', '#e647f3')
setBrand('dependencies', '#3b0bf3')
setBrand('duplicate', '#8a8a8a')
setBrand('enhancement', '#18bff3')
setBrand('good first issue', '#410758')
setBrand('help wanted', '#15610c')
setBrand('invalid', '#f3e700')

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue ... } */) => {
  // something to do
}
