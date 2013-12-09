class ApisController < ApplicationController
  def api
    query = params[:band]
    key = ENV["ECHONEST_KEY"]
    url = "http://developer.echonest.com/api/v4/artist/profile?api_key=" + key + "&name=" + query + "&format=json&bucket=biographies&bucket=blogs"
    # raise url.inspect
    req = Typhoeus.get(url)
    render :json => req.body

  end

end


# http://developer.echonest.com/api/v4/artist/profile?api_key=7BXTVE4UNRULDHBZ3&name=vampire%20weekend&format=json&bucket=biographies&bucket=blogs

# http://developer.echonest.com/api/v4/artist/profile?api_key=7BXTVE4UNRULDHBZ3&id=ARH6W4X1187B99274F&format=json&bucket=biographies&bucket=blogs&bucket=familiarity&bucket=hotttnesss&bucket=images&bucket=news&bucket=reviews&bucket=terms&bucket=urls&bucket=video&bucket=id:musicbrainz