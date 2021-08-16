import redis, time, subprocess

rd = redis.Redis()

rd.execute_command("bgsave")
time.sleep(2000)
backup_dir = rd.execute_command("CONFIG get dir")
subprocess.call("docker cp redis:{0} dump.rdb".format(backup_dir[1]), shell=True)
