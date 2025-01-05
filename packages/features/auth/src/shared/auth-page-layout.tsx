import React from 'react';

import { View } from 'react-native';

import { H1, H4 } from '@kit/ui';

export function AuthPageLayout(props: React.PropsWithChildren) {
  const childrenArray = React.Children.toArray(props.children);

  const childrenByType = {
    logo: childrenArray.find(
      (child) =>
        React.isValidElement(child) && child.type === AuthPageLayoutLogo,
    ),
    form: childrenArray.find(
      (child) =>
        React.isValidElement(child) && child.type === AuthPageLayoutForm,
    ),
    formHeading: childrenArray.find(
      (child) =>
        React.isValidElement(child) && child.type === AuthPageLayoutHeading,
    ),
    formDescription: childrenArray.find(
      (child) =>
        React.isValidElement(child) && child.type === AuthPageLayoutDescription,
    ),
    secondaryActionButton: childrenArray.find(
      (child) =>
        React.isValidElement(child) &&
        child.type === AuthPageLayoutSecondaryButton,
    ),
  };

  return (
    <View className={'w-full gap-4'}>
      <View className={'justify-left top-16 text-left'}>
        {childrenByType.logo}
      </View>

      <View className={'top-28 px-8'}>
        <H1>{childrenByType.formHeading}</H1>
        <H4>{childrenByType.formDescription}</H4>
      </View>

      <View className={'top-28'}>{childrenByType.form}</View>

      <View className={'top-24 px-8'}>
        {childrenByType.secondaryActionButton}
      </View>
    </View>
  );
}

export function AuthPageLayoutLogo(props: React.PropsWithChildren) {
  return props.children;
}

export function AuthPageLayoutForm(props: React.PropsWithChildren) {
  return props.children;
}

export function AuthPageLayoutHeading(props: React.PropsWithChildren) {
  return props.children;
}

export function AuthPageLayoutDescription(props: React.PropsWithChildren) {
  return props.children;
}

export function AuthPageLayoutSecondaryButton(props: React.PropsWithChildren) {
  return props.children;
}
