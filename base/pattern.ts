export class Pattern {
  public static email = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
  public static phone = '(([0])([0-9]{10}))$';
  public static tell = '(([0])([0-9]{10}))$';
  public static nationalCode = '(([0-9]{10}))$';
  public static date = '^(([0-9]{1})([.,\/]([0-9]{1,2})){0,1}|([۰-۹]{1})([.,\/]([۰-۹]{1,2})){0,1})';
  public static bankCard = '((([1-9])([0-9]{18})||([۱-۹])([۰-۹]{18}))||(([1-9])([0-9]{15})||([۱-۹])([۰-۹]{15})))$';
  public static bcNumber = '[1-9]{1}|[1-9][0-9]{2}|[۱-۹]{1}|[۱-۹][۰-۹]{2}]'; // شماره شناسنامه
  public static password = '[-_/@!#$%^&*().A-Za-z0-9]+';
  public static number = '[0-9]';
  public static numberAndText = '[0-9]*|[A-Za-z]*';
  public static postalCode = '((([1-9]{1})([0-9]{9})))$';
  public static nameAndFamily = '([آ-ی ]+)+([آ-ی])';
  public static username = '[A-Za-z]*';
}
