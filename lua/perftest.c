#include <lua.h>
#include <stdio.h>
#include <lauxlib.h>
#include <string.h>
#include <unistd.h>
static char HexToChar[16]= { '0', '1', '2', '3', '4', '5', '6', '7',
                             '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

char *hex2str(const unsigned char* pBinary, char isBCD, char* pString, short binaryLen)
{
    short    i;
    unsigned char    tempBYTE;

    for(i = 0; i < binaryLen; i++)
    {
        tempBYTE = pBinary[i];
        if (isBCD)
        {
            pString[i*2]   = HexToChar[tempBYTE & 0x0f];
            pString[i*2+1] = HexToChar[tempBYTE >> 4];
        }
        else
        {
            pString[i*2+1] = HexToChar[tempBYTE & 0x0f];
            pString[i*2]   = HexToChar[tempBYTE >> 4];
        }
    }
    pString[binaryLen*2] = 0;
	return pString;
}

int lua_hex2str(lua_State *L)
{
	const unsigned char* pBinary;
	char buffer[256];
	size_t  len;
	int iNum=lua_gettop(L);
	
	/* 获取任务ID */
	if(iNum == 1 && lua_isstring(L,1))
	{
		pBinary = lua_tolstring(L,1, &len);
		hex2str(pBinary, 0, buffer, len);
		lua_pushstring(L, buffer);
	}
	else
		lua_pushstring(L, "");
	return 1;
}
Usage()
{
	printf("Usage:perftest usernum domnum recnum format script\n");
	printf("  format 0-csv 1-zte\n");
	exit(0);
}
int main (int argc, char **argv) 
{
	if (argc != 6)Usage();
	
	int usernum=atoi(argv[1]);
	int domnum=atoi(argv[2]);
	int recnum=atoi(argv[3]);
	int format =atoi(argv[4]);
	char *script = argv[5];
	
	char buffer[1000], tmp[40];
	char IMSI[10][16]={
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01},
		{0x12,0x34,0x45,0x67,0x89,0x01,0x23,045,0x67,0x89,0x12,0x34,0x45,0x67,0x89,0x01}};
	int fieldnum=512;
	int recordnum;
	int i, j, k;
    lua_State *L = luaL_newstate();
	//加载库
	luaL_openlibs(L);
	
	lua_register(L, "hex2str", lua_hex2str);
	
	luaL_dofile(L, script);

	lua_getglobal(L,"lua_test");
	int callback = (int)luaL_ref(L, LUA_REGISTRYINDEX); 
	
	for (i=0; i<usernum; i++)
	{
		for (j=0; j<domnum; j++)
		{
			//if (j<10)recordnum = 10;
			//else recordnum = 1;
			//lua_getglobal(L,"lua_test");
			lua_rawgeti(L, LUA_REGISTRYINDEX, callback);
			if (format == 1)
			{
				lua_pushstring(L, "imsi");
				lua_pushinteger(L, i);
			}

			lua_newtable(L);
			for(k=0; k<recnum; k++)
			{
				lua_pushlstring(L, IMSI[k], 16);
				lua_rawseti(L, -2, k+1);
			}
			if (format == 1)lua_call(L,3,1);
			else lua_call(L,1,1);
			lua_pop(L,1);
			/*if(lua_isstring(L,-1))
			{
				printf("%d:%s\n",i,lua_tostring(L,-1));
			}*/
		}
		if ((i+1)%100000 ==0)printf("%10d complete!\n", i+1);
	}
	lua_close(L);
	return 0;
}
