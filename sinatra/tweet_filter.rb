require 'tweetstream'
require File.join(File.dirname(__FILE__), 'tweet_store')

TweetStream.configure do |config|
  config.consumer_key = 'lDfxmkGkdIZrlMqxciCJ6A'
  config.consumer_secret = 'u84I8ZGY9bjZl2GoG6BwLSV78oj7YtFLzr5ZMkgbfG8'
  config.oauth_token = '90048571-JSrGz2lVHuKpqDLV6FFKI0dT51TNwsQfUs3nOtUGy'
  config.oauth_token_secret = 'Kzp1P40Sa7X0aUADDKQThPUapghR2JfMb5iZc6j8qNY'
  config.auth_method = :oauth
  config.parser   = :yajl
end

STORE = TweetStore.new
# @pic_urls = []
# @screen_names = []
TweetStream::Client.new.track('photo') do |status, client|
  if status.entities && status.entities.key?(:media) && status.entities.media.first["type"] == "photo"
    #@screen_names << status.user.screen_name
    @pic_urls << status#.entities.media.first['media_url']

    STORE.push(
      'id' => status[:id],
      'text' => status.text,
      'username' => status.user.screen_name,
      'photo_url' => status.entities.media.first['media_url'],
      'userid' => status.user[:id],
      'name' => status.user.name,
      'profile_image_url' => status.user.profile_image_url,
      'received_at' => Time.new.to_i
    )
  end
  #client.stop if @pic_urls.size >= 1
end



# TweetStream::Client.new(USERNAME, PASSWORD).track('lol') do |status|
#   # Ignore replies. Probably not relevant in your own filter app, but we want
#   # to filter out funny tweets that stand on their own, not responses.
#   if status.text !~ /^@\w+/
#     # Yes, we could just store the Status object as-is, since it's actually just a
#     # subclass of Hash. But Twitter results include lots of fields that we don't
#     # care about, so let's keep it simple and efficient for the web app.
#     STORE.push(
#       'id' => status[:id],
#       'text' => status.text,
#       'username' => status.user.screen_name,
#       'userid' => status.user[:id],
#       'name' => status.user.name,
#       'profile_image_url' => status.user.profile_image_url,
#       'received_at' => Time.new.to_i
#     )
#   end
# end