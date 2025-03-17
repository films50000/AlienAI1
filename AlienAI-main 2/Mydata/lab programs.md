1) Write a program in C++ language can recognize the letter.
#include<iostream.h>
#include<ctype.h>
#include<string.h>
void main()
{
char s[100];
int i,n;
cout<<"Enter the string pleas : ";
cin>>s; cout<<"\n";
n=strlen(s);
for(i=0;i<n;i++)
if (isalpha(s[i])) cout<<s[i]<<" letter"<<"\n" ;
else cout<<s[i]<<" nooot letter"<<"\n" ;
}
2) Write a program in C++ language can recognize the digit.
#include<iostream.h>
#include<ctype.h>
#include<string.h>
void main()
{
char s[100];
int i,n;
cout<<"Enter the string pleas : ";
cin>>s; cout<<"\n";
n=strlen(s);
for(i=0;i<n;i++)
if (isdigit(s[i])) cout<<s[i]<<" digit"<<"\n" ;
else cout<<s[i]<<" nooot digit"<<"\n" ;
}

