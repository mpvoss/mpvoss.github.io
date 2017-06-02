str1="<li class=\""
#left or right
str2=" clearfix\"><span class=\"chat-img pull-"
#left or right
str2a="\"><img src=\""
#image
str3="\" width=\"50\" height=\"50\" alt=\"User Avatar\" class=\"img-circle\" /></span><div class=\"chat-body clearfix\"><div class=\"header\">"
strTimeStart = "<small class=\""
strTimeMid=" text-muted\"><i class=\"fa fa-clock-o fa-fw\" aria-hidden=\"true\"></i>"
#time
strTimeEnd="</small>"
strNameStart="<strong class=\""
strNameMiddle=" primary-font\">"
#name
strNameEnd="</strong>"
strNextToLast = "</div><p>"
#text
strEnd="</p></div></li>"


myData=['right','images/matthew.jpg', 'Matthew Voss'] #timestart first
robotData=['left','images/robot.jpg','AI']

output = ""
last_time = 60
with open('/tmp/aiChat.txt') as f:
    content = f.readlines()
    content = [x.strip() for x in content]
    for line in content:
        parts = line.split(':')
        data = None

        if len(line) < 3:
            continue

        if parts[0] == 'me':
            data = myData
        else:
            data = robotData
        last_time -= 3
        output = str1 + data[0] +str2+data[0]+str2a+ data[1]+str3

        if parts[0] == 'me':
            output = output + strTimeStart + strTimeMid+' ' + str(last_time)+ ' minutes ago ' + strTimeEnd
            output = output + strNameStart + 'pull-right' + strNameMiddle + data[2] + strNameEnd
        else:
            output = output + strNameStart + data[0] + strNameMiddle + data[2] + strNameEnd
            output = output + strTimeStart + 'pull-right'+strTimeMid + str(last_time) + ' minutes ago ' + strTimeEnd

        output = output + strNextToLast + parts[1] + strEnd
        print(output)






