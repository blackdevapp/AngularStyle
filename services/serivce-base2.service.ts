import {ServiceBase} from './service-base.service';
import {Route, Router} from "@angular/router";
import {Subject} from 'rxjs';
import {NotifyConfig} from "../base/notify/notify-config";
import {Notify} from "../base/notify/notify";
import {Memory} from "../base/memory";
import {AppSettings} from "../app.setting";

declare const $: any;

// @Injectable()
export class ServiceBase2 extends ServiceBase {
  constructor() {
    super();
  }

  getService(_url) {
    const ret = new Subject();
    super.getService(_url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        console.log('___________omad___________', AppSettings.DOMAIN)
        window.location.href = '/logout'
        // this.router.navigateByUrl('/logout');

        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }

  // getServiceBuffer(_url) {
  //   const ret = new Subject();
  //   super.getServiceBuffer(_url).subscribe((res:any) => {
  //     if (res) {
  //       ret.next(res);
  //     }
  //   }, error => {
  //     if (error.status === 500) {
  //       const notifyConfig = new NotifyConfig(
  //         Notify.Type.DANGER,
  //         Notify.Placement.TOP_LEFT,
  //         Notify.TEMPLATES.Template2,
  //         'error in connection to the server!'
  //         ,
  //         ''
  //       );
  //       Notify.showNotify(notifyConfig);
  //     }
  //     if (error.status == 403){
  //       const notifyConfig = new NotifyConfig(
  //         Notify.Type.DANGER,
  //         Notify.Placement.TOP_LEFT,
  //         Notify.TEMPLATES.Template2,
  //         'have no access to this request!'
  //         ,
  //         ''
  //       );
  //       Notify.showNotify(notifyConfig);
  //     }
  //
  //     if (error.status == 401) {
  //       const notifyConfig = new NotifyConfig(
  //         Notify.Type.DANGER,
  //         Notify.Placement.TOP_LEFT,
  //         Notify.TEMPLATES.Template2,
  //         'Authentication Error!'
  //         ,
  //         ''
  //       );
  //       Notify.showNotify(notifyConfig);
  //     }
  //     if (error.status == 400) {
  //       const notifyConfig = new NotifyConfig(
  //         Notify.Type.DANGER,
  //         Notify.Placement.TOP_LEFT,
  //         Notify.TEMPLATES.Template2,
  //         'Bad Data'
  //         ,
  //         ''
  //       );
  //       Notify.showNotify(notifyConfig);
  //     }
  //     if (error.status == 0) {
  //       const notifyConfig = new NotifyConfig(
  //         Notify.Type.WARNING,
  //         Notify.Placement.TOP_LEFT,
  //         // null,
  //         Notify.TEMPLATES.Template2,
  //         'please check your internet connection!'
  //         ,
  //         ''
  //       );
  //       Notify.showNotify(notifyConfig);
  //     } else
  //       console.log('error.status ' + error.status);
  //   });
  //   return ret.asObservable();
  // }


  postService(_url, value: any) {
    const ret = new Subject();
    super.postService(value, _url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'


        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }


  putService(_url, value: any) {
    const ret = new Subject();
    super.putService(value, _url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'


        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }


  deleteService(parentId: string) {
    const ret = new Subject();
    super.deleteService(parentId).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'

        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }


  getServiceF(_url) {
    const ret = new Subject();

    super.getServiceF(_url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'


        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }


  postServiceF(_url, value: any) {
    const ret = new Subject();
    super.postServiceF(value, _url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'


        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }


  putServiceF(_url, value: any) {
    const ret = new Subject();
    super.putServiceF(value, _url).subscribe((res: any) => {
      if (res) {
        ret.next(res);
      }
    }, error => {
      ret.error(error);
      Memory.setLoading(false)
      if (error.status === 500) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'error in connection to the server!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 403) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'have no access to this request!'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }

      if (error.status == 401) {
        window.location.href = '/logout'


        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_LEFT,
          Notify.TEMPLATES.Template2,
          'Authentication Error!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      }
      if (error.status == 400) {
        // const notifyConfig = new NotifyConfig(
        //   Notify.Type.DANGER,
        //   Notify.Placement.TOP_LEFT,
        //   Notify.TEMPLATES.Template2,
        //   'Bad Data'
        //   ,
        //   ''
        // );
        // Notify.showNotify(notifyConfig);
      }
      if (error.status == 0) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_LEFT,
          // null,
          Notify.TEMPLATES.Template2,
          'please check your internet connection!'
          ,
          ''
        );
        Notify.showNotify(notifyConfig);
      } else
        console.log('error.status ' + error.status);
    });
    return ret.asObservable();
  }

}
