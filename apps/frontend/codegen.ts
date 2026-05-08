import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: 'src/**/*.graphql',
  overwrite: true,
  generates: {
    'src/app/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        scalars: {
          DateTime: 'string',
        },
        skipDocumentsValidation: true,
        strictScalars: false,
        useTypeImports: true,
        nonOptionalTypename: false,
        avoidOptionals: false,
        addExplicitOverride: false,
        strictTypedOperations: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
