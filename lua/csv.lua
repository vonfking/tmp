local _hex2str = hex2str
function lua_test(IMSI)
	r = ""
	for i,v in ipairs(IMSI)
    do
		--print("lua:"..i)
        r = r .. hex2str(v)
	end
	--print(r)
    --print(string.format("lua:parameter len is %d", string.len(IMSI)))
    --print(string.format("lua:parameter is %s", IMSI))
	--a = hex2str(IMSI)
	--print(string.format("lua:result is %s", a))
	--error("1111")
    return r
end