namespace :dev do 
  desc "Builds widget configuration markup."
  task :init => :environment do

    def colorize(text, color_code)
      puts "\e[#{color_code}m#{text}\e[0m"
    end

    set_timestamps = system('./git-meta set')
    if set_timestamps
      colorize("timestamps set!", 32)
    else
      colorize("timestamps not set!", 31)
    end

    set_pre_commit_hook_sym = system('ln -s -f ../../git-hooks/post-merge .git/hooks/post-merge')
    set_post_merge_git_hook_sym = system('ln -s -f ../../git-hooks/pre-commit .git/hooks/pre-commit')
    if set_pre_commit_hook_sym && set_post_merge_git_hook_sym 
      colorize("git hook symlinks set!", 32)
    else
      colorize("git hook symlinks not set!", 31)
    end

  end
end
