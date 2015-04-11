/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['Open Pinboard'],
  /**
   * Your New Relic license key.
   */
  license_key: 'e545f0104aab8d56f6feecbd93854124404ffa7a',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
    rules : {
        ignore : [
            '^/socket.io/.*/xhr-polling'
        ]
    }
}
