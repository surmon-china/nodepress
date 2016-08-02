<div class="wrap">
    <div id="icon-options-general" class="icon32"><br></div><h2>插件设置</h2><br>
	<?php
					if (isset($_POST["cleancache"]) && check_admin_referer('nm-cleancache')) {
                        if( nm_get_setting("objcache") ){
                            wp_cache_flush();
                        } else {
					global $wpdb;
						$sql = "DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_/netease%'";
						$sql1 = "DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_timeout_/netease%'";
			$clean = $wpdb -> query( $sql );
			$clean = $wpdb -> query( $sql1 );
        }
						echo "<div class='updated'><p>清除成功.</p></div>";
					}
				?>
    <form method="post" action="options.php">
        <?php
            settings_fields( 'nm_setting_group' );
            $setting = nm_get_setting();
        ?>
        <table class="form-table">
            <tbody>
            <tr valign="top">
                <th scope="row"><label>使用方法</label></th>
                <td><p>方法1：</p>
                    <p>新建一个页面：文本框输入 <code>[nm][/nm]</code> 即可</p>
                    <p>方法2：</p>
                    <p>新建一个模板，使用下面的函数：</p>
                    <p>添加 <code>&lt;?php netease_music();?&gt;</code> 到需要的位置</p>
					<p>方法3：</p>
                    <p>直接选择模版即可</p>
					<p>更多帮助请查看<a href="http://fatesinger.com/74369">帮助文章</a></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label>显示设置</label></th>
                <td>
                    <ul class="nm-color-ul">
                        <?php $color = array(
                            array(
                                'title' => '帐号ID',
                                'key' => 'id',
                                'default' => '30829298'
                            ),
                            array(
                                'title' => '每行显示专辑数量',
                                'key' => 'number',
                                'default' => '4'
                            ),
                            array(
                                'title' => '每页显示专辑数量',
                                'key' => 'perpage',
                                'default' => '12'
                            ),
							array(
                                'title' => '专辑宽度',
                                'key' => 'coverwidth',
                                'default' => '180'
                            ),
							array(
                                'title' => '数据缓存时间',
                                'key' => 'cachetime',
                                'default' => '604800 '
                            ),
                        );
                            foreach ($color as $key => $V) {
                                ?>
                                <li class="nm-color-li">
                                    <code><?php echo $V['title'];?></code>
                                    <?php $color = $setting[$V['key']] ? $setting[$V['key']] : $V['default'];?>
                                    <input name="<?php echo nm_setting_key($V['key']);?>" type="text" value="<?php echo $color;?>" id="nm-default-color" class="regular-text nm-color-picker" />
                                </li>
                            <?php }
                        ?>
                    </ul>
                    <p class="description">点击你的个人主页，URL类似为<code>http://music.163.com/#/user/home?id=30829298</code>，<code>30829298</code>就是你的ID</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="url">音乐页面地址</label></th>
                <td>
                    <select name="<?php echo nm_setting_key('pagename');?>" id="pagename">
                        <?php $config_name = nm_get_setting("pagename");$pages = get_pages(array('post_type' => 'page','post_status' => 'publish'));
							echo "<option class='level-0' value=''>不选择</option>";
                            foreach($pages as $val){
                                $selected = ($val->ID == $config_name)? 'selected="selected"' : "";
                                $page_title = $val->post_title;
                                $page_name = $val->ID;
                                echo "<option class='level-0' value='{$page_name}' {$selected}>{$page_title}</option>";
                            }
                        ?>
                    </select>
                </td>
            </tr>
			<tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('lyric');?>">歌词显示</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('lyric');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('lyric');?>" id="lyric" value="1" <?php if(nm_get_setting("lyric")) echo 'checked="checked"';?>>
                    </label>
					<p class="description">因为歌词是单独获取的，如果歌单中歌曲过多速度会很慢。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('tworow');?>">歌曲列表双列</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('tworow');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('tworow');?>" id="tworow" value="1" <?php if(nm_get_setting("tworow")) echo 'checked="checked"';?>>
                    </label>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('objcache');?>">对象缓存</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('objcache');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('objcache');?>" id="objcache" value="1" <?php if(nm_get_setting("objcache")) echo 'checked="checked"';?>>
                    </label>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="nm-submit-form">
            <input type="submit" class="button-primary muhermit_submit_form_btn" name="save" value="<?php _e('Save Changes') ?>"/>
        </div>
    </form>
	<h2>清除缓存</h2>
	<p>将清除所有歌曲缓存</p>
				
				<form method="post">
					<p><input type='submit' name='cleancache' class="button-primary muhermit_submit_form_btn" value='清除缓存'/></p>
					<?php wp_nonce_field('nm-cleancache'); ?>
				</form>
    <style>
        .nm-color-li{position: relative;padding-left: 120px}
        .nm-color-li code{position: absolute;left: 0;top: 1px;}
    </style>
</div>