/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation updateMovie($document: MoviesInput) {
    updateMovie(document: $document) {
      ...MovieFormFragment
    }
  }

Arguments: 

  - document: the document to insert

Child Props:

  - createMovie(document)
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection } from 'meteor/vulcan:core';

export default function withCreate(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName),
        fragmentName = getFragmentName(fragment),
        typeName = collection.options.typeName;

  // wrap component with graphql HoC
  return graphql(gql`
    mutation create${typeName}($document: ${collection.options.collectionName}Input) {
      create${typeName}(document: $document) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: `withCreate${typeName}`,
    props: ({ownProps, mutate}) => ({
      [`create${typeName}`]: ({document}) => {
        return mutate({ 
          variables: { document },
        });
      },
      // OpenCRUD backwards compatibility
      newMutation: ({document}) => {
        return mutate({ 
          variables: { document },
        });
      }
    }),
  });

}