require 'rubygems'
require 'bundler/setup'
require 'sinatra/base'
require 'omniauth-facebook'
require 'tweetstream'
require 'nestful'
require File.expand_path('../database', __FILE__)


SCOPE = 'email,offline_access,user_photos'

class App < Sinatra::Base

	configure do
  	set :public_folder, Proc.new { File.join(root, "static") }
  	enable :sessions
	end
  # server-side flow
  get '/' do
    # NOTE: you would just hit this endpoint directly from the browser
    #       in a real app. the redirect is just here to setup the root 
    #       path in this example sinatra app.
    #redirect '/auth/facebook'
    erb "<a href='/auth/facebook'>Sign in with Facebook</a>"
  end
  
  # client-side flow
  get '/client-side' do

  	erb :clientside
    #content_type 'text/html'
    # NOTE: when you enable cookie below in the FB.init call
    #       the GET request in the FB.login callback will send
    #       a signed request in a cookie back the OmniAuth callback
    #       which will parse out the authorization code and obtain
    #       the access_token. This will be the exact same access_token
    #       returned to the client in response.authResponse.accessToken.

  end

  get '/auth/:provider/callback' do
  	omniauth = request.env['omniauth.auth']
  	User.create!(:uid => omniauth[:uid], :nickname => omniauth[:info][:nickname], :token => omniauth[:credentials][:token], :email => omniauth[:info][:email])

    api_key = "9c62b0d2526dee43a19e9a2e3c246dca"
  	api_secret = "ac8af199056669266585dd34ee7680be"

    uids = "#{omniauth[:uid]}@facebook.com"
    namespace = "facebook.com"

    #callback = "AWS ip"

    # Face.com train call with user info
    Nestful.post "https://api.face.com/faces/train.json?api_key=#{api_key}&api_secret=#{api_secret}&uids=#{uids}&namespace=#{namespace}&user_auth=fb_user:#{omniauth[:uid]},fb_oauth_token:#{omniauth[:credentials][:token]}&", :format => :form

  	redirect '/success'
  end

  get '/success' do
  	#erb "success"
   erb :success
  end
  
  get '/auth/failure' do
    content_type 'application/json'
    MultiJson.encode(request.env)
  end

end



class User < ActiveRecord::Base
end








# configure do
#   set :public_folder, Proc.new { File.join(root, "static") }
#   enable :sessions
# end

# SCOPE = 'email,read_stream,offline_access,user_photos'

# TweetStream.configure do |config|
#   config.consumer_key = 'lDfxmkGkdIZrlMqxciCJ6A'
#   config.consumer_secret = 'u84I8ZGY9bjZl2GoG6BwLSV78oj7YtFLzr5ZMkgbfG8'
#   config.oauth_token = '90048571-JSrGz2lVHuKpqDLV6FFKI0dT51TNwsQfUs3nOtUGy'
#   config.oauth_token_secret = 'Kzp1P40Sa7X0aUADDKQThPUapghR2JfMb5iZc6j8qNY'
#   config.auth_method = :oauth
#   config.parser   = :yajl
# end

# use Rack::Session::Cookie
# use OmniAuth::Builder do
#   provider :facebook, '265707230172470', '7c3134b537fd40eb5ed5081df7dae700', :scope => SCOPE
#   #provider :twitter, 'consumerkey', 'consumersecret'
# end



# #class App < Sinatra::Base
# 	get '/' do
# 		#redirect '/auth/facebook'
# 	  erb "<a href='/auth/facebook'>Sign in with Facebook</a>"
	  
# 	end

# 	get '/clientside' do
# 		erb :clientside
# 	end

# 	get '/auth/:provider/callback' do
# 		  content_type 'application/json'
# 	    MultiJson.encode(request.env)
# 	  #auth = request.env['omniauth.auth']
# 	  # do whatever you want with the information!
# 	end

#   get '/auth/failure' do
#     content_type 'application/json'
#     MultiJson.encode(request.env)
#   end

# #end

# # get '/' do
# # 	"Hello World, it's #{Time.now} at the server!"
# # end


# #  media_url
# # tweet handle
# # location
# # time

# # @pic_urls = []
# # TweetStream::Client.new.track('photo') do |status, client|
# # 	if status.entities && status.entities.key?(:media) && status.entities.media.first["type"] == "photo"
# # 		@screen_name << status.user.screen_name
# #   	@pic_urls << status.entities.media.first['media_url']
# # 	end
# #   client.stop if @pic_urls.size >= 10
# # end
