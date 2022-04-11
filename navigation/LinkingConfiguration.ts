/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<any> = {
  prefixes: [Linking.createURL('/'), 'http://localhost:19006'],
  config: {
    screens: {
      Dashboard: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'Home',
              PersonalCalendar: 'PersonalCalendar',
            },
          },
          GroupDashboard: {
            path: 'Group/:gid',
            parse: {
              gid: (gid: any) => `${gid}`,
            },
            stringify: {
              gid: (gid: any) => gid,
            },
            screens: {
              Group: 'GroupHome',
              GroupMembers: 'GroupMembers',
              GroupCalendar: 'GroupCalendar',
              EventDashboard: {
                screens: {
                  Event: {
                    path: 'Event/:eid',
                    parse: {
                      eid: (eid: any) => `${eid}`,
                    },
                    stringify: {
                      eid: (eid: any) => eid,
                    },
                  },
                }
              }
            },
          },
          EventDashboard: {
            path: 'Event/:eid',
                parse: {
                  eid: (eid: any) => `${eid}`,
                },
                stringify: {
                  eid: (eid: any) => eid,
                },
            screens: {
              Event: '',
            }
          },
        },
      },
      Login: 'Login',
      Signup: '',
    },
  },
};

export default linking;
