import { Get, Post, Put, JsonController, Param, Body, QueryParam, Authorize, HeaderParam, Delete } from '../../../src/index';
import { UserModel } from '../../models/models';
import { isNil } from 'lodash';
import { Utils } from '../../utils';

@JsonController('/user')
export class UserController {
  constructor() {}

  @Authorize(['Admin'])
  @Post('/create')
  public create(@Body() user: UserModel) {
    user.id = Utils.userList.length + 1;
    Utils.userList.push(user);
    return user;
  }

  @Authorize(['Admin'])
  @Get('/get/:id')
  public getById(@Param('id') id: number) {
    var user = Utils.userList.filter(function(obj) {
      return obj.id === id;
    });

    return user;
  }

  @Authorize(['Admin'])
  @Put('/update')
  public update(@Body() user: UserModel) {
    let userAux = Utils.userList.find(x => x.id == user.id);
    let index = Utils.userList.indexOf(userAux);
    Utils.userList[index] = user;
    return true;
  }

  @Authorize()
  @Get('/list')
  public listAll() {
    return Utils.userList;
  }

  @Authorize()
  @Get('/listFilter')
  public listFilter(@QueryParam() params: any) {
    if (!isNil(params)) {
      var users = Utils.userList.filter(function(obj) {
        return obj.name === params.name && obj.age === +params.age;
      });
    }
    return users;
  }

  @Authorize(['Admin'])
  @Delete('/delete/:id')
  public delete(@Param('id') id: number) {
    Utils.userList = Utils.userList.filter(function(obj) {
      return obj.id !== id;
    });
    return true;
  }
}
