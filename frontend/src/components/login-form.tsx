import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { Spinner } from "@/components/ui/spinner";
import { getCaptchaData, login } from "@/utils/request";
import { toast } from "sonner";

interface FormFieldItem {
  value: string;
  error?: string;
}

interface FormFields {
  account: FormFieldItem;
  password: FormFieldItem;
  captcha: FormFieldItem;
}

const initialFields: FormFields = {
  account: { value: "" },
  password: { value: "" },
  captcha: { value: "" },
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLogining, setIsLogining] = React.useState(false);
  const [captchaData, setCaptchaData] = React.useState("");
  const [formFields, setFormFields] = React.useState(initialFields);
  const { account, password, captcha } = formFields;

  useEffect(() => {
    updateCaptcha();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLogining(true);
    const _account = account.value.trim();
    const _password = password.value.trim();
    const _captcha = captcha.value.trim();

    try {
      if (isEmpty(_account)) {
        setFormFields((prev) => ({
          ...prev,
          account: { ...account, error: "账号不能为空" },
        }));
        throw new Error();
      }
      if (_account.length > 256) {
        setFormFields((prev) => ({
          ...prev,
          account: { ...account, error: "账号不能超过256个字符" },
        }));
        throw new Error();
      }
      if (_password.length < 6 || _password.length > 256) {
        setFormFields((prev) => ({
          ...prev,
          password: { ...password, error: "密码长度不能小于6位或超过256位" },
        }));
        throw new Error();
      }
      if (isEmpty(_captcha)) {
        setFormFields((prev) => ({
          ...prev,
          captcha: { ...captcha, error: "验证码不能为空" },
        }));
        throw new Error();
      }

      // 发起登录
      console.log(
        `登录信息：${JSON.stringify({
          sch_id: _account,
          pass: _password,
          captcha: _captcha,
        })}`
      );
      const res = await login({
        sch_id: _account,
        pass: _password,
        captcha: _captcha,
      });

      if (res.statusCode !== 200) {
        toast.error(res.message);
        await updateCaptcha();
        throw new Error();
      }

      toast.success("登录成功！");
    } catch (error) {
    } finally {
      setIsLogining(false);
    }
  };

  const updateCaptcha = async () => {
    const res = await getCaptchaData();
    if (res.statusCode !== 200) {
      console.error(`获取验证码失败：${res.message}`);
      toast.error("获取验证码失败");
      return;
    }
    const encoded = encodeURIComponent(res.data);
    const dataUrl = `data:image/svg+xml,${encoded}`;
    setCaptchaData(dataUrl);
    setFormFields({
      ...formFields,
      captcha: {
        value: "",
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle>开放原子开源社团</CardTitle>
          <CardDescription>输入账号和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field data-invalid={!!account.error}>
                <FieldLabel>账号</FieldLabel>
                <Input
                  id="account"
                  value={account.value}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      account: { value: e.target.value },
                    })
                  }
                />
                {account.error && (
                  <FieldError className="text-xs">{account.error}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!password.error}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <a
                    href=""
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password.value}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      password: { value: e.target.value },
                    })
                  }
                />
                {password.error && (
                  <FieldError className="text-xs">{password.error}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!captcha.error}>
                <FieldLabel>验证码</FieldLabel>
                <div className="flex justify-between gap-2.5">
                  <Input
                    className="flex-1"
                    id="captcha"
                    type="text"
                    value={captcha.value}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        captcha: { value: e.target.value },
                      })
                    }
                  />
                  <img
                    className="w-[100px] h-9 rounded-sm shadow"
                    src={captchaData ? captchaData : undefined}
                    onClick={updateCaptcha}
                  />
                </div>
                {captcha.error && (
                  <FieldError className="text-xs">{captcha.error}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  onClick={onSubmit as any}
                  disabled={isLogining}
                >
                  {isLogining && <Spinner />}
                  登录
                </Button>
                <FieldDescription className="text-center">
                  <a href="" onClick={(e) => e.preventDefault()}>
                    申请注册账号
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
