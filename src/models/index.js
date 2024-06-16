// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Blog, Post, Comment, UserTrip, UserProfile, Address } = initSchema(schema);

export {
  Blog,
  Post,
  Comment,
  UserTrip,
  UserProfile,
  Address
};