import { GraphQLError } from 'graphql/error';

export function FieldNamesAreLowerCamelCased(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      const fieldName = node.name.value;

      const parentName = ancestors[ancestors.length - 1].name.value;

      if (fieldName.match(/^[a-z]/) == null) {
        context.reportError(
          new GraphQLError(
            `The field \`${parentName}.${fieldName}\` should begin with a lower cased letter.`,
            [node]
          )
        );

        return;
      }

      if (fieldName.match(/[\_]/)) {
        context.reportError(
          new GraphQLError(
            `The field \`${parentName}.${fieldName}\` should not have underscores. Use lower camel case instead.`,
            [node]
          )
        );
      }
    },
  };
}
