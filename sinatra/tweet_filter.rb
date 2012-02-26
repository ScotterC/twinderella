require 'tweetstream'
require 'json'
require 'redis'
require 'geokit'
require File.join(File.dirname(__FILE__), 'tweet_store')

TweetStream.configure do |config|
  config.consumer_key = 'lDfxmkGkdIZrlMqxciCJ6A'
  config.consumer_secret = 'u84I8ZGY9bjZl2GoG6BwLSV78oj7YtFLzr5ZMkgbfG8'
  config.oauth_token = '90048571-JSrGz2lVHuKpqDLV6FFKI0dT51TNwsQfUs3nOtUGy'
  config.oauth_token_secret = 'Kzp1P40Sa7X0aUADDKQThPUapghR2JfMb5iZc6j8qNY'
  config.auth_method = :oauth
  config.parser   = :yajl
end

Geokit::default_units = :miles
Geokit::default_formula = :sphere

STORE = TweetStore.new
redis = Redis.new
REDIS_KEY = 'tweets'

@statuses = []

CURRENT_POSITION = "40.735726, -73.99507"
#TweetStream::Client.new
#TweetStream::Daemon.new('tracker')
TweetStream::Client.new.on_error do |message|
  puts message
end.track('photo') do |status, client|
  if status.key?(:entities) && status.entities.key?(:media) && status.entities.media.first["type"] == "photo" && status.key?(:geo) && status.geo != nil && status.geo.key?(:coordinates)
    c = status.geo.coordinates
    unless c.length > 1
      c = c.join(', ')
    end

    if Geokit::LatLng.distance_between(CURRENT_POSITION, c).to_i < 500
      redis.lpush(REDIS_KEY, {

        'id' => status[:id],
        'text' => status.text,

        'username' => status.user.screen_name,
        'photo_url' => status.entities.media.first['media_url'],
        'userid' => status.user[:id],
        'name' => status.user.name,
        'profile_image_url' => status.user.profile_image_url,
        'received_at' => Time.new.to_i

      }.to_json)

      @statuses << status
      client.stop if @statuses.size >= 10
    end
  end
end
