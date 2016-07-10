<?php
    class nmjson{
        public function __construct(){
            //$this->get_token();
        }
        public function netease_song($music_id)
        {
            $key = "/netease/song/$music_id";

            $cache = $this->get_cache($key);
            if( $cache ) return $cache;

            $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
            $response = $this->netease_http($url);

            if( $response["code"]==200 && $response["songs"] ){
                //print_r($response["songs"]);
                //处理音乐信息
                $mp3_url = $response["songs"][0]["mp3Url"];
                $mp3_url = str_replace("http://m", "http://p", $mp3_url);
                $music_name = $response["songs"][0]["name"];
                $mp3_cover = $response["songs"][0]["album"]["picUrl"];
				$song_duration = $response["songs"][0]["duration"];
                $artists = array();

                foreach ($response["songs"][0]["artists"] as $artist) {
                    $artists[] = $artist["name"];
                }

                $artists = implode(",", $artists);

                $result = array(
                    "song_id" => $music_id,
                    "song_title" => $music_name,
                    "song_author" => $artists,
                    "song_src" => $mp3_url,
                    "song_cover" => $mp3_cover,
					"song_duration" => $song_duration
                );

                $this->set_cache($key, $result);

                return $result;
            }

            return false;
        }

        public function netease_songs($song_list)
        {
            if( !$song_list ) return false;

            $songs_array = explode(",", $song_list);
            $songs_array = array_unique($songs_array);

            if( !empty($songs_array) ){
                $result = array();
                foreach( $songs_array as $song_id ){
                    $result['songs'][]  = $this->netease_song($song_id);
                }
                return $result;
            }

            return false;
        }

        public function netease_album($album_id)
        {
            $key = "/netease/album/$album_id";

            $cache = $this->get_cache($key);
            if( $cache ) return $cache;

            $url = "http://music.163.com/api/album/" . $album_id;
            $response = $this->netease_http($url);

            if( $response["code"]==200 && $response["album"] ){
                //处理音乐信息
                $result = $response["album"]["songs"];
                $count = count($result);

                if( $count < 1 ) return false;

                $album_name = $response["album"]["name"];
                $album_author = $response["album"]["artist"]["name"];
                $album_cover = $response["album"]["blurPicUrl"];
                $album = array(
                    "album_id" => $album_id,
                    "album_title" => $album_name,
                    "album_author" => $album_author,
                    "album_type" => "albums",
                    "album_cover" => $album_cover,
                    "album_count" => $count
                );

                foreach($result as $k => $value){
                    $mp3_url = str_replace("http://m", "http://p", $value["mp3Url"]);
                    $album["songs"][] = array(
                        "song_id" => $value["id"],
                        "song_title" => $value["name"],
                        "song_length" => $value["duration"],
                        "song_src" => $mp3_url,
                        "song_author" => $album_author
                    );
                }

                $this->set_cache($key, $album);
                return $album;
            }

            return false;
        }

		
		
        public function netease_playlist($playlist_id)
        {
            $key = "/netease/playlist/$playlist_id";
            netease_music_update_play_count($playlist_id);
            $cache = $this->get_cache($key);
            if( $cache ) return $cache;
            $url = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
            $response = $this->netease_http($url);

            if( $response["code"]==200 && $response["result"] ){
                //处理音乐信息
                $result = $response["result"]["tracks"];
                $count = count($result);

                if( $count < 1 ) return false;

                $collect_name = $response["result"]["name"];
                $collect_author = $response["result"]["creator"]["nickname"];

                $collect = array(
                    "collect_id" => $playlist_id,
                    "collect_title" => $collect_name,
                    "collect_author" => $collect_author,
                    "collect_type" => "collects",
                    "collect_count" => $count
                );

                foreach($result as $k => $value){
                    $mp3_url = str_replace("http://m", "http://p", $value["mp3Url"]);
                    $artists = array();
                    foreach ($value["artists"] as $artist) {
                        $artists[] = $artist["name"];
                    }

                    $artists = implode(",", $artists);
					$lrc = nm_get_setting("lyric") ? $this->get_song_lrc( $value["id"]) : "";
                    $collect["songs"][] = array(
                        "id" => $value["id"],
                        "title" => $value["name"],
                        "duration" => $value["duration"],
                        "mp3" => $mp3_url,
                        "artist" => $artists,
						"lrc" => $lrc
                    );
                }

                $this->set_cache($key, $collect);

                return $collect;
            }

            return false;
        }
				
		
        public function netease_user($userid)
        {
            $key = "/netease/userinfo/$userid";

            $cache = $this->get_cache($key);
            if( $cache ) return $cache;
            $userplaylist = array();
            $url = "http://music.163.com/api/user/playlist/?offset=0&limit=1001&uid=" . $userid;
            $response = $this->netease_http($url);

            if( $response["code"]==200 && $response["playlist"] ){
                $playlists = $response["playlist"];
                foreach($playlists as $playlist){
                    $userplaylist[] = array(
                        "playlist_id" => $playlist["id"],
                        "playlist_name" => $playlist["name"],
                        "playlist_coverImgUrl" => $playlist["coverImgUrl"]
                    );


                }
                $this->set_cache($key, $userplaylist);
                return $userplaylist;
            }

        }
		
		public function get_song_lrc($songid){
		$key = "/netease/lrc/$songid";

            $cache = $this->get_cache($key);
            if( $cache ) return $cache;

            $url = "http://music.163.com/api/song/media?id=" . $songid;
            $response = $this->netease_http($url);

            if( $response["code"]==200 && $response["lyric"] ){

                $content = $response["lyric"];
				$result = $this->parse_lrc($content);
                $this->set_cache($key, $result);
				return $result;
                
            }

            return false;

	}

	private function parse_lrc($lrc_content){
		$now_lrc = array();
		$lrc_row = explode("\n", $lrc_content);

		foreach ($lrc_row as $key => $value) {
			$tmp = explode("]", $value);

			foreach ($tmp as $key => $val) {
				$tmp2 = substr($val, 1, 8);
				$tmp2 = explode(":", $tmp2);

				$lrc_sec = intval( $tmp2[0]*60 + $tmp2[1]*1 );

				if( is_numeric($lrc_sec) && $lrc_sec > 0){
					$count = count($tmp);
					$lrc = trim($tmp[$count-1]);

					if( $lrc != "" ){
						$now_lrc[$lrc_sec] = $lrc;  
					}
				}
			}
		}

		return $now_lrc;	
	}
	
        private function netease_http($url)
        {
            $refer = "http://music.163.com/";
            $header[] = "Cookie: " . "appver=1.5.0.75771;";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($ch, CURLOPT_REFERER, $refer);
            $cexecute = curl_exec($ch);
            curl_close($ch);

            if ($cexecute) {
                $result = json_decode($cexecute, true);
                return $result;
            }else{
                return false;
            }
        }


        public function get_cache($key){
            if ( nm_get_setting("objcache") ){
                $cache = wp_cache_get($key,'neteasemusic');
            } else {
                $cache = get_transient($key);
            }
            
            return $cache === false ? false : json_decode($cache,true);
        }

        public function set_cache($key, $value){
            $value  = json_encode($value);
			$cache_time = nm_get_setting("cachetime") ? nm_get_setting("cachetime") : ( 60 * 60 * 24 * 7);
            if ( nm_get_setting("objcache") ){
                wp_cache_set($key, $value, 'neteasemusic', $cache_time);
            } else {
                set_transient($key, $value, $cache_time);
            }
        }

        public function clear_cache($key){
            if ( nm_get_setting("objcache") ){
                wp_cache_delete($key,'neteasemusic');
            } else {
                delete_transient($key);
            }
            
        }
    }