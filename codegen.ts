import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: 'http://localhost:4000/',
	documents: ['src/**/*.tsx'],
	generates: {
		'./src/graphql/types.ts': {
			plugins: ['typescript', 'typescript-operations', 'named-operations-object'],
			presetConfig: {
				gqlTagName: 'gql'
			}
		}
	},
	ignoreNoDocuments: true
}

export default config
